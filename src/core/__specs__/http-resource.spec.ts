import { http, HttpResponse } from 'msw'
import * as v from 'valibot'
import { afterEach, describe, expect, test } from 'vitest'
import { useAppStore } from '@core/app-store'
import { apiUrl, defineApiRoute, httpResource, refreshRoute } from '@core/http-resource'
import { useSessionStore } from '@core/session-store'
import { server } from '@mocks/server'

const pingRoute = defineApiRoute('GET', '/ping')
const pingUrl = apiUrl(pingRoute.path).href
const okSchema = v.object({ ok: v.boolean() })

const startSession = (accessToken: string, expiresInMs: number) => {
  useSessionStore.getState().setSession({ accessToken, refreshToken: 'refresh-1', expiresAt: Date.now() + expiresInMs })
}

describe('httpResource', () => {
  afterEach(() => {
    useAppStore.getState().setLocale('pt-BR')
  })

  test('sends locale and bearer token headers', async () => {
    useAppStore.getState().setLocale('en')
    startSession('token-1', 60 * 60_000)
    let headers = new Headers()
    server.use(
      http.get(pingUrl, ({ request }) => {
        headers = request.headers
        return HttpResponse.json({ ok: true })
      }),
    )

    await expect(httpResource(pingRoute, { schema: okSchema })).resolves.toEqual({ ok: true })
    expect(headers.get('Accept-Language')).toBe('en')
    expect(headers.get('Authorization')).toBe('Bearer token-1')
  })

  test('maps application/problem+json into a FriendlyError', async () => {
    server.use(
      http.get(pingUrl, () =>
        HttpResponse.json(
          { title: 'Conflito', status: 409, detail: 'Já existe.', errors: { name: ['Nome em uso'] } },
          { status: 409, headers: { 'Content-Type': 'application/problem+json' } },
        ),
      ),
    )

    await expect(httpResource(pingRoute, { schema: okSchema, auth: false })).rejects.toMatchObject({
      name: 'FriendlyError',
      status: 409,
      title: 'Conflito',
      detail: 'Já existe.',
      fieldErrors: { name: ['Nome em uso'] },
    })
  })

  test('normalizes network failures', async () => {
    server.use(http.get(pingUrl, () => HttpResponse.error()))

    await expect(httpResource(pingRoute, { schema: okSchema, auth: false })).rejects.toMatchObject({
      name: 'FriendlyError',
      status: 0,
      title: 'Sem conexão',
    })
  })

  test('rejects responses that break the contract', async () => {
    server.use(http.get(pingUrl, () => HttpResponse.json({ ok: 'yes' })))

    await expect(httpResource(pingRoute, { schema: okSchema, auth: false })).rejects.toMatchObject({
      title: 'Resposta inesperada do servidor',
    })
  })

  test('refreshes an expiring token once for concurrent requests', async () => {
    startSession('stale', 1_000)
    let refreshCalls = 0
    server.use(
      http.post(apiUrl(refreshRoute.path).href, () => {
        refreshCalls += 1
        return HttpResponse.json({ accessToken: 'fresh', refreshToken: 'refresh-2', expiresAt: Date.now() + 60_000 })
      }),
      http.get(pingUrl, ({ request }) => HttpResponse.json({ ok: request.headers.get('Authorization') === 'Bearer fresh' })),
    )

    const results = await Promise.all([
      httpResource(pingRoute, { schema: okSchema }),
      httpResource(pingRoute, { schema: okSchema }),
    ])

    expect(results).toEqual([{ ok: true }, { ok: true }])
    expect(refreshCalls).toBe(1)
  })

  test('clears the session when the API answers 401', async () => {
    startSession('revoked', 60 * 60_000)
    server.use(http.get(pingUrl, () => new HttpResponse(null, { status: 401 })))

    await expect(httpResource(pingRoute, { schema: okSchema })).rejects.toMatchObject({ status: 401 })
    expect(useSessionStore.getState().status).toBe('anonymous')
  })
})
