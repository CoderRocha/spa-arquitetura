import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import * as authSchema from './auth-schema'
import * as appSchema from './schema'

export const schema = { ...authSchema, ...appSchema }

export const createDb = ({ url, authToken }: { url: string; authToken?: string | undefined }) => {
  const client = createClient(authToken ? { url, authToken } : { url })
  return { client, db: drizzle({ client, schema }) }
}

export type Db = ReturnType<typeof createDb>['db']
