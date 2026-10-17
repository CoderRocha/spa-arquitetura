import { ITEM_STATUSES, type Item } from '@core/api/items'
import type { Profile } from '@core/api/profile'
import { createId } from '@core/ids'

export const DEMO_EMAIL = 'demo@example.com'

export const DEMO_PASSWORD = 'password123'

export const ACCESS_TOKEN_TTL_MS = 15 * 60_000

type Account = { profile: Profile; password: string }

type Session = { accountId: string; expiresAt: number }

type Db = {
  accounts: Account[]
  items: Item[]
  sessions: Map<string, Session>
  refreshTokens: Map<string, string>
}

const seedItems = (): Item[] =>
  Array.from({ length: 64 }, (_, index) => ({
    id: createId(),
    name: `Item ${String(index + 1).padStart(2, '0')}`,
    description: '',
    status: ITEM_STATUSES[index % ITEM_STATUSES.length] ?? 'draft',
    quantity: (index * 7) % 50,
    updatedAt: new Date(Date.UTC(2026, 0, 1) + index * 13 * 3_600_000).toISOString(),
  }))

const seed = (): Db => ({
  accounts: [
    {
      password: DEMO_PASSWORD,
      profile: {
        id: createId(),
        name: 'Demo User',
        email: DEMO_EMAIL,
        bio: '',
        avatarUrl: null,
        onboarded: true,
      },
    },
  ],
  items: seedItems(),
  sessions: new Map(),
  refreshTokens: new Map(),
})

export const db: Db = seed()

export const resetDb = () => {
  Object.assign(db, seed())
}

export const issueTokens = (accountId: string) => {
  const accessToken = createId()
  const refreshToken = createId()
  const expiresAt = Date.now() + ACCESS_TOKEN_TTL_MS
  db.sessions.set(accessToken, { accountId, expiresAt })
  db.refreshTokens.set(refreshToken, accountId)
  return { accessToken, refreshToken, expiresAt }
}

export const findAccountByToken = (authorization: string | null) => {
  const session = db.sessions.get(authorization?.replace(/^Bearer /, '') ?? '')
  if (!session || session.expiresAt < Date.now()) return undefined
  return db.accounts.find((account) => account.profile.id === session.accountId)
}
