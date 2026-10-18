import { count, eq } from 'drizzle-orm'
import { Hono } from 'hono'
import type { Metrics } from '@contracts/metrics'
import type { Db } from '@server/db/client'
import { item } from '@server/db/schema'
import type { AppEnv } from '@server/http/env'

export const metricsRoutes = (db: Db) =>
  new Hono<AppEnv>().get('/summary', async (c) => {
    const rows = await db
      .select({ status: item.status, total: count() })
      .from(item)
      .where(eq(item.ownerId, c.get('authUserId')))
      .groupBy(item.status)
    const totalOf = (status: string) => rows.find((row) => row.status === status)?.total ?? 0
    const metrics: Metrics = {
      totalItems: rows.reduce((sum, row) => sum + row.total, 0),
      activeItems: totalOf('active'),
      draftItems: totalOf('draft'),
      archivedItems: totalOf('archived'),
    }
    return c.json(metrics)
  })
