import { delay, http, HttpResponse } from 'msw'
import * as v from 'valibot'
import { authRoutes } from '@core/api/auth'
import { ITEM_SORT_FIELDS, itemRoutes, type Item, type ItemSortField } from '@core/api/items'
import { metricsRoutes } from '@core/api/metrics'
import { profileRoutes } from '@core/api/profile'
import { apiUrl, refreshRoute } from '@core/http-resource'
import { createId } from '@core/ids'
import { itemFormSchema } from '@features/items/schemas'
import { profileFormSchema } from '@features/profile/schemas'
import { db, findAccountByToken, issueTokens } from '@mocks/db'

const url = (path: string) => apiUrl(path).href

const itemUrl = url('/items/:itemId')

type ItemParams = { itemId: string }

const latency = () => (import.meta.env.MODE === 'mock' ? delay() : undefined)

const problem = (
  status: number,
  title: string,
  detail?: string,
  errors?: Readonly<Record<string, readonly string[] | undefined>>,
) =>
  HttpResponse.json(
    { type: 'about:blank', status, title, detail, errors },
    { status, headers: { 'Content-Type': 'application/problem+json' } },
  )

const unauthorized = () => problem(401, 'Sessão expirada', 'Entre novamente para continuar.')

const notFound = () => problem(404, 'Item não encontrado', 'O item pode ter sido excluído.')

const invalid = (issues: [v.BaseIssue<unknown>, ...v.BaseIssue<unknown>[]]) =>
  problem(422, 'Dados inválidos', 'Revise os campos destacados.', v.flatten(issues).nested)

const credentialsSchema = v.object({ email: v.string(), password: v.string() })

const signUpSchema = v.object({ name: v.string(), email: v.string(), password: v.string() })

const refreshSchema = v.object({ refreshToken: v.string() })

const compareBy = (field: ItemSortField) => (a: Item, b: Item) => {
  const left = a[field]
  const right = b[field]
  return typeof left === 'number' && typeof right === 'number' ? left - right : String(left).localeCompare(String(right))
}

const nameTaken = (name: string, ignoreId?: string) =>
  db.items.some((item) => item.id !== ignoreId && item.name.toLowerCase() === name.toLowerCase())

const countByStatus = (status: Item['status']) => db.items.filter((item) => item.status === status).length

const nameTakenProblem = () =>
  problem(409, 'Nome em uso', 'Já existe um item com esse nome.', { name: ['Já existe um item com esse nome.'] })

export const handlers = [
  http.post(url(authRoutes.signIn.path), async ({ request }) => {
    await latency()
    const body = v.safeParse(credentialsSchema, await request.json())
    const account = body.success
      ? db.accounts.find(
          (candidate) =>
            candidate.profile.email.toLowerCase() === body.output.email.toLowerCase() &&
            candidate.password === body.output.password,
        )
      : undefined
    if (!account) return problem(401, 'Credenciais inválidas', 'E-mail ou senha incorretos.')
    return HttpResponse.json(issueTokens(account.profile.id))
  }),

  http.post(url(authRoutes.signUp.path), async ({ request }) => {
    await latency()
    const body = v.safeParse(signUpSchema, await request.json())
    if (!body.success) return invalid(body.issues)
    const { name, email, password } = body.output
    if (db.accounts.some((account) => account.profile.email.toLowerCase() === email.toLowerCase())) {
      return problem(409, 'E-mail em uso', 'Já existe uma conta com esse e-mail.', {
        email: ['Este e-mail já está em uso.'],
      })
    }
    const profile = { id: createId(), name, email, bio: '', avatarUrl: null, onboarded: false }
    db.accounts.push({ profile, password })
    return HttpResponse.json(issueTokens(profile.id), { status: 201 })
  }),

  http.post(url(refreshRoute.path), async ({ request }) => {
    await latency()
    const body = v.safeParse(refreshSchema, await request.json())
    const accountId = body.success ? db.refreshTokens.get(body.output.refreshToken) : undefined
    if (!body.success || !accountId) return unauthorized()
    db.refreshTokens.delete(body.output.refreshToken)
    return HttpResponse.json(issueTokens(accountId))
  }),

  http.post(url(authRoutes.signOut.path), ({ request }) => {
    db.sessions.delete(request.headers.get('Authorization')?.replace(/^Bearer /, '') ?? '')
    return new HttpResponse(null, { status: 204 })
  }),

  http.get(url(profileRoutes.current.path), async ({ request }) => {
    await latency()
    const account = findAccountByToken(request.headers.get('Authorization'))
    if (!account) return unauthorized()
    return HttpResponse.json(account.profile)
  }),

  http.put(url(profileRoutes.update.path), async ({ request }) => {
    await latency()
    const account = findAccountByToken(request.headers.get('Authorization'))
    if (!account) return unauthorized()
    const body = v.safeParse(profileFormSchema, await request.json())
    if (!body.success) return invalid(body.issues)
    account.profile = { ...account.profile, ...body.output, onboarded: true }
    return HttpResponse.json(account.profile)
  }),

  http.post(url(profileRoutes.avatar.path), async ({ request }) => {
    await latency()
    const account = findAccountByToken(request.headers.get('Authorization'))
    if (!account) return unauthorized()
    const file = (await request.formData()).get('file')
    if (!(file instanceof File)) return problem(422, 'Arquivo inválido', 'Envie uma imagem.')
    // ponytail: object URL lives only in this tab, a real backend returns a persisted URL
    const avatarUrl = typeof URL.createObjectURL === 'function' ? URL.createObjectURL(file) : null
    account.profile = { ...account.profile, avatarUrl }
    return HttpResponse.json(account.profile)
  }),

  http.get(url(itemRoutes.list.path), async ({ request }) => {
    await latency()
    if (!findAccountByToken(request.headers.get('Authorization'))) return unauthorized()
    const params = new URL(request.url).searchParams
    const page = Math.max(1, Number(params.get('page') ?? 1))
    const pageSize = Math.min(100, Math.max(1, Number(params.get('pageSize') ?? 20)))
    const sort = ITEM_SORT_FIELDS.find((field) => field === params.get('sort')) ?? 'updatedAt'
    const direction = params.get('order') === 'asc' ? 1 : -1
    const query = (params.get('q') ?? '').toLowerCase()
    const matches = db.items
      .filter((item) => item.name.toLowerCase().includes(query))
      .toSorted((a, b) => compareBy(sort)(a, b) * direction)
    return HttpResponse.json({ items: matches.slice((page - 1) * pageSize, page * pageSize), total: matches.length })
  }),

  http.post(url(itemRoutes.create.path), async ({ request }) => {
    await latency()
    if (!findAccountByToken(request.headers.get('Authorization'))) return unauthorized()
    const body = v.safeParse(itemFormSchema, await request.json())
    if (!body.success) return invalid(body.issues)
    if (nameTaken(body.output.name)) return nameTakenProblem()
    const item: Item = { ...body.output, id: createId(), updatedAt: new Date().toISOString() }
    db.items.unshift(item)
    return HttpResponse.json(item, { status: 201 })
  }),

  http.get<ItemParams>(itemUrl, async ({ request, params }) => {
    await latency()
    if (!findAccountByToken(request.headers.get('Authorization'))) return unauthorized()
    const item = db.items.find((candidate) => candidate.id === params.itemId)
    return item ? HttpResponse.json(item) : notFound()
  }),

  http.put<ItemParams>(itemUrl, async ({ request, params }) => {
    await latency()
    if (!findAccountByToken(request.headers.get('Authorization'))) return unauthorized()
    const index = db.items.findIndex((candidate) => candidate.id === params.itemId)
    const current = db.items[index]
    if (!current) return notFound()
    const body = v.safeParse(itemFormSchema, await request.json())
    if (!body.success) return invalid(body.issues)
    if (nameTaken(body.output.name, current.id)) return nameTakenProblem()
    const item: Item = { ...current, ...body.output, updatedAt: new Date().toISOString() }
    db.items[index] = item
    return HttpResponse.json(item)
  }),

  http.delete<ItemParams>(itemUrl, async ({ request, params }) => {
    await latency()
    if (!findAccountByToken(request.headers.get('Authorization'))) return unauthorized()
    const before = db.items.length
    db.items = db.items.filter((item) => item.id !== params.itemId)
    return db.items.length === before ? notFound() : new HttpResponse(null, { status: 204 })
  }),

  http.get(url(metricsRoutes.summary.path), async ({ request }) => {
    await latency()
    if (!findAccountByToken(request.headers.get('Authorization'))) return unauthorized()
    return HttpResponse.json({
      totalItems: db.items.length,
      activeItems: countByStatus('active'),
      draftItems: countByStatus('draft'),
      archivedItems: countByStatus('archived'),
    })
  }),
]
