import { randomUUID } from 'node:crypto'
import { and, asc, count, desc, eq, ne, sql } from 'drizzle-orm'
import { Hono } from 'hono'
import * as v from 'valibot'
import {
  ITEM_PAGE_SIZE_MAX,
  ITEM_SEARCH_MAX,
  ITEM_SORT_FIELDS,
  itemInputSchema,
  type Item,
} from '@contracts/items'
import type { Db } from '@server/db/client'
import { item } from '@server/db/schema'
import type { AppEnv } from '@server/http/env'
import { messagesFor, type Locale } from '@server/http/messages'
import { invalidProblem, problemResponse } from '@server/http/problem'

const listQuerySchema = v.object({
  page: v.fallback(v.pipe(v.string(), v.toNumber(), v.integer(), v.minValue(1)), 1),
  pageSize: v.fallback(v.pipe(v.string(), v.toNumber(), v.integer(), v.minValue(1), v.maxValue(ITEM_PAGE_SIZE_MAX)), 20),
  sort: v.fallback(v.picklist(ITEM_SORT_FIELDS), 'updatedAt'),
  order: v.fallback(v.picklist(['asc', 'desc']), 'desc'),
  q: v.fallback(v.pipe(v.string(), v.trim(), v.maxLength(ITEM_SEARCH_MAX)), ''),
})

const sortColumns = {
  name: item.name,
  status: item.status,
  quantity: item.quantity,
  updatedAt: item.updatedAt,
}

type ItemRow = typeof item.$inferSelect

const toItem = ({ id, name, description, status, quantity, updatedAt }: ItemRow): Item => ({
  id,
  name,
  description,
  status,
  quantity,
  updatedAt: updatedAt.toISOString(),
})

const notFound = (locale: Locale) => problemResponse({ status: 404, ...messagesFor(locale).notFound })

const nameTaken = (locale: Locale) => {
  const { title, detail, field } = messagesFor(locale).nameTaken
  return problemResponse({ status: 409, title, detail, errors: { name: [field] } })
}

export const itemRoutes = (db: Db) => {
  const isNameTaken = async (ownerId: string, name: string, ignoreId = '') => {
    const match = await db
      .select({ id: item.id })
      .from(item)
      .where(and(eq(item.ownerId, ownerId), sql`lower(${item.name}) = ${name.toLowerCase()}`, ne(item.id, ignoreId)))
      .get()
    return match !== undefined
  }

  return new Hono<AppEnv>()
    .get('/', async (c) => {
      const query = v.parse(listQuerySchema, c.req.query())
      const where = and(
        eq(item.ownerId, c.get('authUserId')),
        query.q ? sql`instr(lower(${item.name}), ${query.q.toLowerCase()}) > 0` : undefined,
      )
      const direction = query.order === 'asc' ? asc : desc
      const [rows, totals] = await Promise.all([
        db
          .select()
          .from(item)
          .where(where)
          .orderBy(direction(sortColumns[query.sort]), asc(item.id))
          .limit(query.pageSize)
          .offset((query.page - 1) * query.pageSize),
        db.select({ total: count() }).from(item).where(where),
      ])
      return c.json({ items: rows.map(toItem), total: totals[0]?.total ?? 0 })
    })
    .post('/', async (c) => {
      const body = v.safeParse(itemInputSchema, await c.req.json().catch(() => null))
      if (!body.success) return invalidProblem(c.get('locale'), body.issues)
      const ownerId = c.get('authUserId')
      if (await isNameTaken(ownerId, body.output.name)) return nameTaken(c.get('locale'))
      const [created] = await db
        .insert(item)
        .values({ ...body.output, id: randomUUID(), ownerId, updatedAt: new Date() })
        .returning()
      return created ? c.json(toItem(created), 201) : notFound(c.get('locale'))
    })
    .get('/:itemId', async (c) => {
      const row = await db
        .select()
        .from(item)
        .where(and(eq(item.id, c.req.param('itemId')), eq(item.ownerId, c.get('authUserId'))))
        .get()
      return row ? c.json(toItem(row)) : notFound(c.get('locale'))
    })
    .put('/:itemId', async (c) => {
      const body = v.safeParse(itemInputSchema, await c.req.json().catch(() => null))
      if (!body.success) return invalidProblem(c.get('locale'), body.issues)
      const ownerId = c.get('authUserId')
      const itemId = c.req.param('itemId')
      if (await isNameTaken(ownerId, body.output.name, itemId)) return nameTaken(c.get('locale'))
      const [updated] = await db
        .update(item)
        .set({ ...body.output, updatedAt: new Date() })
        .where(and(eq(item.id, itemId), eq(item.ownerId, ownerId)))
        .returning()
      return updated ? c.json(toItem(updated)) : notFound(c.get('locale'))
    })
    .delete('/:itemId', async (c) => {
      const deleted = await db
        .delete(item)
        .where(and(eq(item.id, c.req.param('itemId')), eq(item.ownerId, c.get('authUserId'))))
        .returning({ id: item.id })
      return deleted.length > 0 ? c.body(null, 204) : notFound(c.get('locale'))
    })
}
