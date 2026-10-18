import { createMiddleware } from 'hono/factory'
import type { Auth } from '@server/auth'
import type { AppEnv } from '@server/http/env'
import { messagesFor } from '@server/http/messages'
import { problemResponse } from '@server/http/problem'

export const loadSession = (auth: Auth) =>
  createMiddleware<AppEnv>(async (c, next) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers })
    c.set('userId', session?.user.id ?? null)
    await next()
  })

export const requireAuth = createMiddleware<AppEnv>(async (c, next) => {
  const userId = c.get('userId')
  if (!userId) return problemResponse({ status: 401, ...messagesFor(c.get('locale')).unauthorized })
  c.set('authUserId', userId)
  await next()
})
