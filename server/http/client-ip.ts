import { getConnInfo } from '@hono/node-server/conninfo'
import type { Context } from 'hono'
import type { AppEnv } from '@server/http/env'

export const clientIp = (c: Context<AppEnv>, trustProxy: boolean) => {
  if (trustProxy) {
    const forwarded = c.req.header('x-forwarded-for')?.split(',')[0]?.trim()
    if (forwarded) return forwarded
  }
  try {
    return getConnInfo(c).remote.address ?? 'unknown'
  } catch {
    return 'unknown'
  }
}
