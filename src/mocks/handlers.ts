import { delay, http, HttpResponse } from 'msw'
import * as v from 'valibot'
import { ITEM_SORT_FIELDS, itemInputSchema, type Item, type ItemSortField } from '@contracts/items'
import { profileInputSchema, type Profile } from '@contracts/profile'
import { authRoutes } from '@core/api/auth'
import { itemRoutes } from '@core/api/items'
import { metricsRoutes } from '@core/api/metrics'
import { profileRoutes } from '@core/api/profile'
import { apiUrl } from '@core/http-resource'
import { createId } from '@core/ids'
import { currentAccount, db } from '@mocks/db'

const url = (path: string) => apiUrl(path).href

const itemUrl = url('/items/:itemId')

type ItemParams = { itemId: string }

type StoredItem = (typeof db.items)[number]

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

const authUser = ({ id, name, email }: Profile) => ({ id, name, email })

const toItem = ({ ownerId: _ownerId, ...item }: StoredItem): Item => item

const compareBy = (field: ItemSortField) => (a: Item, b: Item) => {
  const left = a[field]
  const right = b[field]
  return typeof left === 'number' && typeof right === 'number' ? left - right : String(left).localeCompare(String(right))
}

const itemsOf = (ownerId: string) => db.items.filter((item) => item.ownerId === ownerId)

const nameTaken = (ownerId: string, name: string, ignoreId?: string) =>
  itemsOf(ownerId).some((item) => item.id !== ignoreId && item.name.toLowerCase() === name.toLowerCase())

const nameTakenProblem = () =>
  problem(409, 'Nome em uso', 'Já existe um item com esse nome.', { name: ['Já existe um item com esse nome.'] })

const findOwnedItem = (ownerId: string, itemId: string) =>
  db.items.findIndex((item) => item.ownerId === ownerId && item.id === itemId)

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
    db.currentAccountId = account.profile.id
    return HttpResponse.json({ redirect: false, token: 'mock', user: authUser(account.profile) })
  }),

  http.post(url(authRoutes.signUp.path), async ({ request }) => {
    await latency()
    const body = v.safeParse(signUpSchema, await request.json())
    if (!body.success) return invalid(body.issues)
    const { name, email, password } = body.output
    if (db.accounts.some((account) => account.profile.email.toLowerCase() === email.toLowerCase())) {
      return problem(422, 'E-mail em uso', 'Já existe uma conta com esse e-mail.', {
        email: ['Este e-mail já está em uso.'],
      })
    }
    const profile = { id: createId(), name, email, bio: '', avatarUrl: null, onboarded: false }
    db.accounts.push({ profile, password })
    db.currentAccountId = profile.id
    return HttpResponse.json({ token: 'mock', user: authUser(profile) })
  }),

  http.post(url(authRoutes.signOut.path), () => {
    db.currentAccountId = null
    return HttpResponse.json({ success: true })
  }),

  http.get(url(authRoutes.session.path), () => {
    const account = currentAccount()
    return HttpResponse.json(account ? { session: { userId: account.profile.id }, user: authUser(account.profile) } : null)
  }),

  http.get(url(profileRoutes.current.path), async () => {
    await latency()
    const account = currentAccount()
    if (!account) return unauthorized()
    return HttpResponse.json(account.profile)
  }),

  http.put(url(profileRoutes.update.path), async ({ request }) => {
    await latency()
    const account = currentAccount()
    if (!account) return unauthorized()
    const body = v.safeParse(profileInputSchema, await request.json())
    if (!body.success) return invalid(body.issues)
    account.profile = { ...account.profile, ...body.output, onboarded: true }
    return HttpResponse.json(account.profile)
  }),

  http.post(url(profileRoutes.avatar.path), async ({ request }) => {
    await latency()
    const account = currentAccount()
    if (!account) return unauthorized()
    const file = (await request.formData()).get('file')
    if (!(file instanceof File)) return problem(422, 'Arquivo inválido', 'Envie uma imagem.')
    // ponytail: object URL lives only in this tab, the real API serves the uploaded file
    const avatarUrl = typeof URL.createObjectURL === 'function' ? URL.createObjectURL(file) : null
    account.profile = { ...account.profile, avatarUrl }
    return HttpResponse.json(account.profile)
  }),

  http.get(url(itemRoutes.list.path), async ({ request }) => {
    await latency()
    const account = currentAccount()
    if (!account) return unauthorized()
    const params = new URL(request.url).searchParams
    const page = Math.max(1, Number(params.get('page') ?? 1))
    const pageSize = Math.min(100, Math.max(1, Number(params.get('pageSize') ?? 20)))
    const sort = ITEM_SORT_FIELDS.find((field) => field === params.get('sort')) ?? 'updatedAt'
    const direction = params.get('order') === 'asc' ? 1 : -1
    const query = (params.get('q') ?? '').toLowerCase()
    const matches = itemsOf(account.profile.id)
      .filter((item) => item.name.toLowerCase().includes(query))
      .toSorted((a, b) => compareBy(sort)(a, b) * direction)
    return HttpResponse.json({
      items: matches.slice((page - 1) * pageSize, page * pageSize).map(toItem),
      total: matches.length,
    })
  }),

  http.post(url(itemRoutes.create.path), async ({ request }) => {
    await latency()
    const account = currentAccount()
    if (!account) return unauthorized()
    const body = v.safeParse(itemInputSchema, await request.json())
    if (!body.success) return invalid(body.issues)
    if (nameTaken(account.profile.id, body.output.name)) return nameTakenProblem()
    const item = { ...body.output, id: createId(), ownerId: account.profile.id, updatedAt: new Date().toISOString() }
    db.items.unshift(item)
    return HttpResponse.json(toItem(item), { status: 201 })
  }),

  http.get<ItemParams>(itemUrl, async ({ params }) => {
    await latency()
    const account = currentAccount()
    if (!account) return unauthorized()
    const item = db.items[findOwnedItem(account.profile.id, params.itemId)]
    return item ? HttpResponse.json(toItem(item)) : notFound()
  }),

  http.put<ItemParams>(itemUrl, async ({ request, params }) => {
    await latency()
    const account = currentAccount()
    if (!account) return unauthorized()
    const index = findOwnedItem(account.profile.id, params.itemId)
    const current = db.items[index]
    if (!current) return notFound()
    const body = v.safeParse(itemInputSchema, await request.json())
    if (!body.success) return invalid(body.issues)
    if (nameTaken(account.profile.id, body.output.name, current.id)) return nameTakenProblem()
    const item = { ...current, ...body.output, updatedAt: new Date().toISOString() }
    db.items[index] = item
    return HttpResponse.json(toItem(item))
  }),

  http.delete<ItemParams>(itemUrl, async ({ params }) => {
    await latency()
    const account = currentAccount()
    if (!account) return unauthorized()
    const index = findOwnedItem(account.profile.id, params.itemId)
    if (index === -1) return notFound()
    db.items.splice(index, 1)
    return new HttpResponse(null, { status: 204 })
  }),

  http.get(url(metricsRoutes.summary.path), async () => {
    await latency()
    const account = currentAccount()
    if (!account) return unauthorized()
    const owned = itemsOf(account.profile.id)
    const countByStatus = (status: Item['status']) => owned.filter((item) => item.status === status).length
    return HttpResponse.json({
      totalItems: owned.length,
      activeItems: countByStatus('active'),
      draftItems: countByStatus('draft'),
      archivedItems: countByStatus('archived'),
    })
  }),
]
