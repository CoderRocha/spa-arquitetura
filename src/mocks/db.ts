import { ITEM_STATUSES, type Item } from '@contracts/items'
import type { Profile } from '@contracts/profile'

export const DEMO_USER_ID = 'demo-user'

export const DEMO_EMAIL = 'demo@example.com'

export const DEMO_PASSWORD = 'password123'

const SEED_START_MS = Date.UTC(2026, 0, 1)

const HOUR_MS = 3_600_000

type Account = { profile: Profile; password: string }

type StoredItem = Item & { ownerId: string }

type Db = {
  accounts: Account[]
  items: StoredItem[]
  currentAccountId: string | null
}

const seedItems = (): StoredItem[] =>
  Array.from({ length: 64 }, (_, index) => ({
    id: crypto.randomUUID(),
    ownerId: DEMO_USER_ID,
    name: `Item ${String(index + 1).padStart(2, '0')}`,
    description: '',
    status: ITEM_STATUSES[index % ITEM_STATUSES.length] ?? 'draft',
    quantity: (index * 7) % 50,
    updatedAt: new Date(SEED_START_MS + index * 13 * HOUR_MS).toISOString(),
  }))

const seed = (): Db => ({
  accounts: [
    {
      password: DEMO_PASSWORD,
      profile: {
        id: DEMO_USER_ID,
        name: 'Demo User',
        email: DEMO_EMAIL,
        bio: '',
        avatarUrl: null,
        onboarded: true,
      },
    },
  ],
  items: seedItems(),
  currentAccountId: null,
})

export const db: Db = seed()

export const resetDb = () => {
  Object.assign(db, seed())
}

// ponytail: single "browser session" in memory; the real API uses Better Auth httpOnly cookies
export const currentAccount = () => db.accounts.find((account) => account.profile.id === db.currentAccountId)
