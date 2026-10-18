import { serve } from '@hono/node-server'
import { createApp } from '@server/app'
import { createAuth } from '@server/auth'
import { createDb } from '@server/db/client'
import { loadEnv } from '@server/env'

const env = loadEnv()
const { db } = createDb({ url: env.TURSO_DATABASE_URL, authToken: env.TURSO_AUTH_TOKEN })
const auth = createAuth({
  db,
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  trustedOrigins: [env.CORS_ORIGIN],
})
const app = createApp({
  db,
  auth,
  corsOrigin: env.CORS_ORIGIN,
  trustProxy: env.TRUST_PROXY,
  storageDir: env.STORAGE_DIR,
})

serve({ fetch: app.fetch, port: env.PORT }, (info) => {
  console.info(`API em http://localhost:${info.port}`)
})
