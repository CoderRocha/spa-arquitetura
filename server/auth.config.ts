import { createAuth } from './auth'
import { createDb } from './db/client'

export const auth = createAuth({
  db: createDb({ url: ':memory:' }).db,
  secret: 'schema-generation-only-secret-000000000',
  baseURL: 'http://localhost:5173',
  trustedOrigins: [],
})
