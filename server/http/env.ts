import type { Locale } from '@server/http/messages'

export type AppEnv = {
  Variables: {
    locale: Locale
    clientIp: string
    userId: string | null
    authUserId: string
  }
}
