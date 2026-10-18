import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { createMiddleware } from 'hono/factory'
import { CLIENT_IP_HEADER, type Auth } from '@server/auth'
import type { Db } from '@server/db/client'
import { clientIp } from '@server/http/client-ip'
import type { AppEnv } from '@server/http/env'
import { localeOf, messagesFor } from '@server/http/messages'
import { problemResponse, toAuthProblem } from '@server/http/problem'
import { rateLimit, type RateLimitRule } from '@server/http/rate-limit'
import { loadSession, requireAuth } from '@server/http/session'
import { itemRoutes } from '@server/routes/items'
import { metricsRoutes } from '@server/routes/metrics'
import { profileRoutes } from '@server/routes/profile'

export type AppLimits = {
  api: RateLimitRule
  upload: RateLimitRule
}

export const DEFAULT_LIMITS: AppLimits = {
  api: { limit: 120, windowMs: 60_000 },
  upload: { limit: 10, windowMs: 60_000 },
}

type AppDeps = {
  db: Db
  auth: Auth
  corsOrigin: string
  trustProxy: boolean
  storageDir: string
  limits?: AppLimits
}

export const createApp = ({ db, auth, corsOrigin, trustProxy, storageDir, limits = DEFAULT_LIMITS }: AppDeps) => {
  const app = new Hono<AppEnv>()

  app.use('/api/*', cors({ origin: corsOrigin, credentials: true }))
  app.use(
    '/api/*',
    createMiddleware<AppEnv>(async (c, next) => {
      c.set('locale', localeOf(c.req.raw))
      c.set('clientIp', clientIp(c, trustProxy))
      await next()
    }),
  )

  app.on(['GET', 'POST'], '/api/auth/*', async (c) => {
    const headers = new Headers(c.req.raw.headers)
    headers.set(CLIENT_IP_HEADER, c.get('clientIp'))
    const response = await auth.handler(new Request(c.req.raw, { headers }))
    return toAuthProblem(response, c.get('locale'))
  })

  app.get(
    '/api/uploads/*',
    serveStatic({ root: storageDir, rewriteRequestPath: (path) => path.replace(/^\/api\/uploads/, '') }),
  )

  const api = new Hono<AppEnv>()
    .use(loadSession(auth))
    .use(rateLimit({ db, scope: 'api', ...limits.api }))
    .use(requireAuth)
    .route('/items', itemRoutes(db))
    .route('/metrics', metricsRoutes(db))
    .route(
      '/profile',
      profileRoutes({ db, storageDir, uploadRateLimit: rateLimit({ db, scope: 'upload', ...limits.upload }) }),
    )

  app.route('/api', api)

  app.notFound((c) => problemResponse({ status: 404, ...messagesFor(localeOf(c.req.raw)).routeNotFound }))
  app.onError((error, c) => {
    console.error(error)
    return problemResponse({ status: 500, ...messagesFor(localeOf(c.req.raw)).generic })
  })

  return app
}
