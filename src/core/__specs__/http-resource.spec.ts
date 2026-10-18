import { http, HttpResponse } from 'msw'
import * as v from 'valibot'
import { afterEach, describe, expect, test, vi } from 'vitest'
import { useAppStore } from '@core/app-store'
import { apiUrl, defineApiRoute, httpResource } from '@core/http-resource'
import { useSessionStore } from '@core/session-store'
import { server } from '@mocks/server'

const pingRoute = defineApiRoute('GET', '/ping')
const pingUrl = apiUrl(pingRoute.path).href
const okSchema = v.object({ ok: v.boolean() })

describe('httpResource', () => {
  afterEach(() => {
    useAppStore.getState().setLocale('pt-BR')
    vi.restoreAllMocks()
  })

  test('sends the locale header and includes cookies', async () => {
    useAppStore.getState().setLocale('en')
    const fetchSpy = vi.spyOn(globalThis, 'fetch')
    let language: string | null = null
    server.use(
      http.get(pingUrl, ({ request }) => {
        language = request.headers.get('Accept-Language')
        return HttpResponse.json({ ok: true })
      }),
    )

    await expect(httpResource(pingRoute, { schema: okSchema })).resolves.toEqual({ ok: true })
    expect(language).toBe('en')
    expect(fetchSpy.mock.calls[0]?.[1]).toMatchObject({ credentials: 'include' })
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

    await expect(httpResource(pingRoute, { schema: okSchema })).rejects.toMatchObject({
      name: 'FriendlyError',
      status: 409,
      title: 'Conflito',
      detail: 'Já existe.',
      fieldErrors: { name: ['Nome em uso'] },
    })
  })

  test('translates rate limiting without a problem body', async () => {
    server.use(http.get(pingUrl, () => new HttpResponse('Too many requests', { status: 429 })))

    await expect(httpResource(pingRoute, { schema: okSchema })).rejects.toMatchObject({
      status: 429,
      title: 'Muitas tentativas',
    })
  })

  test('normalizes network failures', async () => {
    server.use(http.get(pingUrl, () => HttpResponse.error()))

    await expect(httpResource(pingRoute, { schema: okSchema })).rejects.toMatchObject({
      name: 'FriendlyError',
      status: 0,
      title: 'Sem conexão',
    })
  })

  test('rejects responses that break the contract', async () => {
    server.use(http.get(pingUrl, () => HttpResponse.json({ ok: 'yes' })))

    await expect(httpResource(pingRoute, { schema: okSchema })).rejects.toMatchObject({
      title: 'Resposta inesperada do servidor',
    })
  })

  test('clears the session when the API answers 401', async () => {
    useSessionStore.getState().setAuthenticated()
    server.use(http.get(pingUrl, () => new HttpResponse(null, { status: 401 })))

    await expect(httpResource(pingRoute, { schema: okSchema })).rejects.toMatchObject({ status: 401 })
    expect(useSessionStore.getState().status).toBe('anonymous')
  })
})
