import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { migrate } from 'drizzle-orm/libsql/migrator'
import * as v from 'valibot'
import { afterEach, describe, expect, test } from 'vitest'
import { itemPageSchema, itemSchema } from '@contracts/items'
import { createApp, DEFAULT_LIMITS, type AppLimits } from '@server/app'
import { createAuth } from '@server/auth'
import { createDb } from '@server/db/client'
import { readSeedSql } from '@server/db/seed-sql'

const ORIGIN = 'http://localhost:5173'

const clients: Array<{ close: () => void }> = []

afterEach(() => {
  for (const client of clients.splice(0)) client.close()
})

const setup = async (limits: AppLimits = DEFAULT_LIMITS) => {
  const { client, db } = createDb({ url: ':memory:' })
  clients.push(client)
  await migrate(db, { migrationsFolder: 'server/db/migrations' })
  await client.executeMultiple(await readSeedSql())
  const auth = createAuth({ db, secret: 'test-secret-'.padEnd(40, 'x'), baseURL: ORIGIN, trustedOrigins: [ORIGIN] })
  const app = createApp({ db, auth, corsOrigin: ORIGIN, trustProxy: true, storageDir: join(tmpdir(), 'spa-api-storage'), limits })

  const call = (path: string, init: { method?: string; body?: unknown; cookie?: string; ip?: string } = {}) =>
    app.request(path, {
      method: init.method ?? 'GET',
      headers: {
        Origin: ORIGIN,
        'Content-Type': 'application/json',
        'X-Forwarded-For': init.ip ?? '10.0.0.1',
        ...(init.cookie ? { Cookie: init.cookie } : {}),
      },
      body: init.body === undefined ? null : JSON.stringify(init.body),
    })

  const signIn = async (email = 'demo@example.com', password = 'password123') => {
    const response = await call('/api/auth/sign-in/email', { method: 'POST', body: { email, password } })
    expect(response.status).toBe(200)
    return cookieOf(response)
  }

  return { call, signIn }
}

const cookieOf = (response: Response) =>
  response.headers
    .getSetCookie()
    .map((cookie) => cookie.split(';')[0])
    .join('; ')

describe('API (Turso + Better Auth)', () => {
  test('signs in with the seeded demo user and lists its 64 items', async () => {
    const { call, signIn } = await setup()
    const cookie = await signIn()

    const response = await call('/api/items?pageSize=5', { cookie })
    const page = v.parse(itemPageSchema, await response.json())

    expect(response.status).toBe(200)
    expect(page.total).toBe(64)
    expect(page.items[0]?.name).toBe('Item 64')
    expect(response.headers.get('RateLimit-Limit')).toBe('120')
  })

  test('returns the profile and metrics of the seeded user', async () => {
    const { call, signIn } = await setup()
    const cookie = await signIn()

    expect(await (await call('/api/profile', { cookie })).json()).toMatchObject({
      email: 'demo@example.com',
      onboarded: true,
    })
    expect(await (await call('/api/metrics/summary', { cookie })).json()).toEqual({
      totalItems: 64,
      activeItems: 21,
      draftItems: 22,
      archivedItems: 21,
    })
  })

  test('isolates items per user', async () => {
    const { call, signIn } = await setup()
    const signUp = await call('/api/auth/sign-up/email', {
      method: 'POST',
      body: { name: 'Outra Pessoa', email: 'outra@example.com', password: 'password123' },
    })
    const otherCookie = cookieOf(signUp)
    expect(signUp.status).toBe(200)

    const created = await call('/api/items', {
      method: 'POST',
      cookie: otherCookie,
      body: { name: 'Caixa azul', description: '', status: 'active', quantity: 2 },
    })
    const item = v.parse(itemSchema, await created.json())
    expect(created.status).toBe(201)

    expect(await (await call('/api/items', { cookie: otherCookie })).json()).toMatchObject({ total: 1 })
    expect((await call(`/api/items/${item.id}`, { cookie: await signIn() })).status).toBe(404)
  })

  test('rejects anonymous requests with problem+json', async () => {
    const { call } = await setup()

    const response = await call('/api/items')

    expect(response.status).toBe(401)
    expect(response.headers.get('Content-Type')).toContain('application/problem+json')
    expect(await response.json()).toMatchObject({ title: 'Sessão expirada' })
  })

  test('translates Better Auth errors into problem+json', async () => {
    const { call } = await setup()

    const wrongPassword = await call('/api/auth/sign-in/email', {
      method: 'POST',
      body: { email: 'demo@example.com', password: 'wrong-password' },
    })
    const duplicated = await call('/api/auth/sign-up/email', {
      method: 'POST',
      body: { name: 'Demo', email: 'demo@example.com', password: 'password123' },
      ip: '10.0.0.2',
    })

    expect(wrongPassword.status).toBe(401)
    expect(await wrongPassword.json()).toMatchObject({ title: 'Credenciais inválidas' })
    expect(duplicated.status).toBe(422)
    expect(await duplicated.json()).toMatchObject({ errors: { email: ['Este e-mail já está em uso.'] } })
  })

  test('rate limits sign-in attempts per IP', async () => {
    const { call } = await setup()
    const attempt = () =>
      call('/api/auth/sign-in/email', {
        method: 'POST',
        body: { email: 'demo@example.com', password: 'wrong-password' },
        ip: '10.0.0.9',
      })

    for (let index = 0; index < 5; index += 1) expect((await attempt()).status).toBe(401)
    const blocked = await attempt()

    expect(blocked.status).toBe(429)
    expect(blocked.headers.get('Retry-After')).toBeTruthy()
    expect(await blocked.json()).toMatchObject({ title: 'Muitas tentativas' })
  })

  test('rate limits API routes per user', async () => {
    const { call, signIn } = await setup({ ...DEFAULT_LIMITS, api: { limit: 2, windowMs: 60_000 } })
    const cookie = await signIn()

    expect((await call('/api/metrics/summary', { cookie })).status).toBe(200)
    expect((await call('/api/metrics/summary', { cookie })).status).toBe(200)
    const blocked = await call('/api/metrics/summary', { cookie })

    expect(blocked.status).toBe(429)
    expect(blocked.headers.get('RateLimit-Remaining')).toBe('0')
    expect(blocked.headers.get('Retry-After')).toBeTruthy()
  })
})
