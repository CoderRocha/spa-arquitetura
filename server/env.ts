import * as v from 'valibot'

const dbEnvSchema = v.object({
  TURSO_DATABASE_URL: v.optional(v.pipe(v.string(), v.nonEmpty()), 'file:local.db'),
  TURSO_AUTH_TOKEN: v.optional(v.string()),
})

const envSchema = v.object({
  ...dbEnvSchema.entries,
  BETTER_AUTH_SECRET: v.pipe(v.string(), v.minLength(32, 'BETTER_AUTH_SECRET precisa ter pelo menos 32 caracteres')),
  BETTER_AUTH_URL: v.optional(v.pipe(v.string(), v.url()), 'http://localhost:5173'),
  CORS_ORIGIN: v.optional(v.pipe(v.string(), v.url()), 'http://localhost:5173'),
  PORT: v.optional(v.pipe(v.string(), v.toNumber(), v.integer()), '8787'),
  TRUST_PROXY: v.optional(
    v.pipe(
      v.picklist(['true', 'false']),
      v.transform((value) => value === 'true'),
    ),
    'false',
  ),
  STORAGE_DIR: v.optional(v.string(), 'server/storage'),
})

type Source = Record<string, string | undefined>

export type Env = v.InferOutput<typeof envSchema>

export const loadDbEnv = (source: Source = process.env) => v.parse(dbEnvSchema, source)

export const loadEnv = (source: Source = process.env): Env => v.parse(envSchema, source)
