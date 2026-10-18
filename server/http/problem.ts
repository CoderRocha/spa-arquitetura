import * as v from 'valibot'
import { messagesFor, type Locale } from '@server/http/messages'

type ProblemInit = {
  status: number
  title: string
  detail?: string | undefined
  errors?: Readonly<Record<string, readonly string[] | undefined>> | undefined
  headers?: Record<string, string>
}

export const problemResponse = ({ status, title, detail, errors, headers }: ProblemInit) =>
  new Response(JSON.stringify({ type: 'about:blank', status, title, detail, errors }), {
    status,
    headers: { ...headers, 'Content-Type': 'application/problem+json' },
  })

export const invalidProblem = (locale: Locale, issues: [v.BaseIssue<unknown>, ...v.BaseIssue<unknown>[]]) =>
  problemResponse({ status: 422, ...messagesFor(locale).invalid, errors: v.flatten(issues).nested })

const authErrorSchema = v.object({
  code: v.optional(v.string()),
  message: v.optional(v.string()),
})

const EMAIL_TAKEN_CODES = new Set(['USER_ALREADY_EXISTS', 'USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL'])

const INVALID_INPUT_CODES = new Set(['INVALID_EMAIL', 'PASSWORD_TOO_SHORT', 'PASSWORD_TOO_LONG', 'VALIDATION_ERROR'])

export const toAuthProblem = async (response: Response, locale: Locale) => {
  if (response.ok) return response
  const text = messagesFor(locale)

  if (response.status === 429) {
    const retryAfter = response.headers.get('X-Retry-After') ?? '60'
    return problemResponse({ status: 429, ...text.tooMany(Number(retryAfter)), headers: { 'Retry-After': retryAfter } })
  }

  const body = v.safeParse(authErrorSchema, await response.clone().json().catch(() => null))
  const code = body.success ? body.output.code : undefined

  if (code === 'INVALID_EMAIL_OR_PASSWORD') return problemResponse({ status: 401, ...text.invalidCredentials })
  if (code && EMAIL_TAKEN_CODES.has(code)) {
    return problemResponse({
      status: 422,
      title: text.emailTaken.title,
      detail: text.emailTaken.detail,
      errors: { email: [text.emailTaken.field] },
    })
  }
  if (code && INVALID_INPUT_CODES.has(code)) return problemResponse({ status: 422, ...text.invalid })

  return problemResponse({
    status: response.status,
    title: text.generic.title,
    detail: body.success ? (body.output.message ?? text.generic.detail) : text.generic.detail,
  })
}
