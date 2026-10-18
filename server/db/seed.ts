import { loadDbEnv } from '@server/env'
import { createDb } from '@server/db/client'
import { readSeedSql } from '@server/db/seed-sql'

const env = loadDbEnv()
const { client } = createDb({ url: env.TURSO_DATABASE_URL, authToken: env.TURSO_AUTH_TOKEN })
await client.executeMultiple(await readSeedSql())
client.close()
console.info('Seed aplicado: demo@example.com / password123 com 64 itens.')
