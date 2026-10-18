import { index, integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { ITEM_STATUSES } from '@contracts/items'
import { user } from './auth-schema'

export const item = sqliteTable(
  'item',
  {
    id: text('id').primaryKey(),
    ownerId: text('owner_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    description: text('description').notNull().default(''),
    status: text('status', { enum: ITEM_STATUSES }).notNull().default('draft'),
    quantity: integer('quantity').notNull().default(0),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => [index('item_owner_updated_idx').on(table.ownerId, table.updatedAt)],
)

export const apiRateLimit = sqliteTable(
  'api_rate_limit',
  {
    key: text('key').notNull(),
    windowStart: integer('window_start').notNull(),
    count: integer('count').notNull(),
  },
  (table) => [primaryKey({ columns: [table.key, table.windowStart] })],
)
