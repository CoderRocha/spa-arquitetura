import { drizzleAdapter } from '@better-auth/drizzle-adapter'
import { betterAuth } from 'better-auth'
import { PASSWORD_MAX, PASSWORD_MIN } from '@contracts/auth'
import * as authSchema from './db/auth-schema'
import type { Db } from './db/client'

export const CLIENT_IP_HEADER = 'x-client-ip'

type AuthConfig = {
  db: Db
  secret: string
  baseURL: string
  trustedOrigins: string[]
  rateLimitEnabled?: boolean
}

export const createAuth = ({ db, secret, baseURL, trustedOrigins, rateLimitEnabled = true }: AuthConfig) =>
  betterAuth({
    secret,
    baseURL,
    basePath: '/api/auth',
    trustedOrigins,
    database: drizzleAdapter(db, { provider: 'sqlite', schema: authSchema }),
    emailAndPassword: {
      enabled: true,
      minPasswordLength: PASSWORD_MIN,
      maxPasswordLength: PASSWORD_MAX,
    },
    user: {
      additionalFields: {
        bio: { type: 'string', required: false, defaultValue: '', input: false },
        onboarded: { type: 'boolean', required: false, defaultValue: false, input: false },
      },
    },
    rateLimit: {
      enabled: rateLimitEnabled,
      storage: 'database',
      window: 60,
      max: 100,
      customRules: {
        '/sign-in/email': { window: 60, max: 5 },
        '/sign-up/email': { window: 60, max: 3 },
      },
    },
    advanced: {
      ipAddress: { ipAddressHeaders: [CLIENT_IP_HEADER] },
    },
  })

export type Auth = ReturnType<typeof createAuth>
