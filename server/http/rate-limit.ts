import { lt, sql } from 'drizzle-orm'
import { createMiddleware } from 'hono/factory'
import type { Db } from '@server/db/client'
import { apiRateLimit } from '@server/db/schema'
import type { AppEnv } from '@server/http/env'
import { messagesFor } from '@server/http/messages'
import { problemResponse } from '@server/http/problem'

export type RateLimitRule = { limit: number; windowMs: number }

type RateLimitOptions = RateLimitRule & {
  db: Db
  scope: string
  now?: () => number
}

export const rateLimit = ({ db, scope, limit, windowMs, now = Date.now }: RateLimitOptions) =>
  createMiddleware<AppEnv>(async (c, next) => {
    const userId = c.get('userId')
    const key = `${scope}:${userId ? `user:${userId}` : `ip:${c.get('clientIp')}`}`
    const current = now()
    const windowStart = current - (current % windowMs)

    const [row] = await db
      .insert(apiRateLimit)
      .values({ key, windowStart, count: 1 })
      .onConflictDoUpdate({
        target: [apiRateLimit.key, apiRateLimit.windowStart],
        set: { count: sql`${apiRateLimit.count} + 1` },
      })
      .returning({ count: apiRateLimit.count })

    // ponytail: opportunistic cleanup; move to a scheduled job (or Redis/Upstash) if traffic grows
    if (Math.random() < 0.01) await db.delete(apiRateLimit).where(lt(apiRateLimit.windowStart, windowStart))

    const count = row?.count ?? 1
    const resetSeconds = Math.ceil((windowStart + windowMs - current) / 1000)
    const headers = {
      'RateLimit-Limit': String(limit),
      'RateLimit-Remaining': String(Math.max(0, limit - count)),
      'RateLimit-Reset': String(resetSeconds),
    }

    if (count > limit) {
      return problemResponse({
        status: 429,
        ...messagesFor(c.get('locale')).tooMany(resetSeconds),
        headers: { ...headers, 'Retry-After': String(resetSeconds) },
      })
    }

    await next()
    for (const [name, value] of Object.entries(headers)) c.res.headers.set(name, value)
  })
