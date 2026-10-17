import { t } from '@lingui/core/macro'
import * as v from 'valibot'
import { useAppStore } from '@core/app-store'
import { API_BASE_URL, TOKEN_REFRESH_MARGIN_MS } from '@core/constants'
import { sessionTokensSchema, useSessionStore } from '@core/session-store'

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export type ApiRoute = { method: HttpMethod; path: string }

export const defineApiRoute = (method: HttpMethod, path: string): ApiRoute => ({ method, path })

export const defineApiRouteFn =
  <TArgs extends unknown[]>(method: HttpMethod, build: (...args: TArgs) => string) =>
  (...args: TArgs): ApiRoute =>
    defineApiRoute(method, build(...args))

export const apiUrl = (path: string) => new URL(`${API_BASE_URL}${path}`, window.location.origin)

export type FriendlyError = Error & {
  name: 'FriendlyError'
  status: number
  title: string
  detail: string | undefined
  fieldErrors: Record<string, string[]>
}

type FriendlyErrorInit = {
  status: number
  title: string
  detail?: string | undefined
  fieldErrors?: Record<string, string[]> | undefined
}

export const createFriendlyError = ({ status, title, detail, fieldErrors = {} }: FriendlyErrorInit): FriendlyError =>
  Object.assign(new Error(detail ?? title), { name: 'FriendlyError' as const, status, title, detail, fieldErrors })

export const isFriendlyError = (error: unknown): error is FriendlyError =>
  error instanceof Error && error.name === 'FriendlyError'

declare module '@tanstack/react-query' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions -- module augmentation needs interface merging
  interface Register {
    defaultError: FriendlyError
  }
}

const problemSchema = v.object({
  title: v.optional(v.string()),
  status: v.optional(v.number()),
  detail: v.optional(v.string()),
  errors: v.optional(v.record(v.string(), v.array(v.string()))),
})

const toFriendlyError = async (response: Response) => {
  const fallback = { status: response.status, title: t`Algo deu errado`, detail: t`Tente novamente em instantes.` }
  if (!response.headers.get('Content-Type')?.includes('application/problem+json')) return createFriendlyError(fallback)
  const problem = v.safeParse(problemSchema, await response.json().catch(() => null))
  if (!problem.success) return createFriendlyError(fallback)
  return createFriendlyError({
    status: problem.output.status ?? response.status,
    title: problem.output.title ?? fallback.title,
    detail: problem.output.detail,
    fieldErrors: problem.output.errors,
  })
}

type Query = Record<string, string | number | boolean | undefined>

type RequestOptions<TSchema> = {
  schema: TSchema
  query?: Query
  signal?: AbortSignal
  auth?: boolean
}

const request = async <TSchema extends v.GenericSchema>(
  route: ApiRoute,
  { schema, query, signal, auth = true }: RequestOptions<TSchema>,
  body?: BodyInit,
  contentType?: string,
): Promise<v.InferOutput<TSchema>> => {
  const headers = new Headers({
    Accept: 'application/json, application/problem+json',
    'Accept-Language': useAppStore.getState().locale,
  })
  if (contentType) headers.set('Content-Type', contentType)
  if (auth) {
    await refreshSessionIfNeeded()
    const token = useSessionStore.getState().tokens?.accessToken
    if (token) headers.set('Authorization', `Bearer ${token}`)
  }

  const url = apiUrl(route.path)
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== '') url.searchParams.set(key, String(value))
  }

  let response: Response
  try {
    response = await fetch(url, { method: route.method, headers, body: body ?? null, signal: signal ?? null })
  } catch (error) {
    if (signal?.aborted) throw error
    throw createFriendlyError({ status: 0, title: t`Sem conexão`, detail: t`Verifique sua internet e tente novamente.` })
  }

  if (!response.ok) {
    if (response.status === 401 && auth) useSessionStore.getState().clearSession()
    throw await toFriendlyError(response)
  }

  const payload: unknown = response.status === 204 ? undefined : await response.json()
  const result = v.safeParse(schema, payload)
  if (!result.success) {
    throw createFriendlyError({ status: response.status, title: t`Resposta inesperada do servidor` })
  }
  return result.output
}

export const httpResource = <TSchema extends v.GenericSchema>(
  route: ApiRoute,
  { body, ...options }: RequestOptions<TSchema> & { body?: unknown },
) =>
  body === undefined
    ? request(route, options)
    : request(route, options, JSON.stringify(body), 'application/json')

export const httpUpload = <TSchema extends v.GenericSchema>(
  route: ApiRoute,
  { formData, ...options }: RequestOptions<TSchema> & { formData: FormData },
) => request(route, options, formData)

export const refreshRoute = defineApiRoute('POST', '/auth/refresh')

let refreshing: Promise<void> | null = null

export const refreshSessionIfNeeded = (): Promise<void> => {
  const { tokens } = useSessionStore.getState()
  if (!tokens || tokens.expiresAt - Date.now() > TOKEN_REFRESH_MARGIN_MS) return Promise.resolve()
  refreshing ??= httpResource(refreshRoute, {
    schema: sessionTokensSchema,
    body: { refreshToken: tokens.refreshToken },
    auth: false,
  })
    .then(useSessionStore.getState().setSession, (error: unknown) => {
      if (isFriendlyError(error) && error.status > 0) useSessionStore.getState().clearSession()
    })
    .finally(() => {
      refreshing = null
    })
  return refreshing
}
