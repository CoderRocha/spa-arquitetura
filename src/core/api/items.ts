import * as v from 'valibot'
import { defineApiRoute, defineApiRouteFn, httpResource } from '@core/http-resource'

export const ITEM_STATUSES = ['draft', 'active', 'archived'] as const

export const ITEM_SORT_FIELDS = ['name', 'status', 'quantity', 'updatedAt'] as const

export const itemSchema = v.object({
  id: v.string(),
  name: v.string(),
  description: v.string(),
  status: v.picklist(ITEM_STATUSES),
  quantity: v.number(),
  updatedAt: v.string(),
})

export const itemPageSchema = v.object({
  items: v.array(itemSchema),
  total: v.number(),
})

export type Item = v.InferOutput<typeof itemSchema>

export type ItemStatus = Item['status']

export type ItemPage = v.InferOutput<typeof itemPageSchema>

export type ItemSortField = (typeof ITEM_SORT_FIELDS)[number]

export type ItemListParams = {
  page: number
  pageSize: number
  sort: ItemSortField
  order: 'asc' | 'desc'
  q: string
}

export type ItemInput = Omit<Item, 'id' | 'updatedAt'>

const itemPath = (id: string) => `/items/${encodeURIComponent(id)}`

export const itemRoutes = {
  list: defineApiRoute('GET', '/items'),
  create: defineApiRoute('POST', '/items'),
  detail: defineApiRouteFn('GET', itemPath),
  update: defineApiRouteFn('PUT', itemPath),
  remove: defineApiRouteFn('DELETE', itemPath),
}

export const fetchItems = (query: ItemListParams, signal?: AbortSignal) =>
  httpResource(itemRoutes.list, { schema: itemPageSchema, query, signal })

export const fetchItem = (id: string, signal?: AbortSignal) =>
  httpResource(itemRoutes.detail(id), { schema: itemSchema, signal })

export const createItem = (body: ItemInput) => httpResource(itemRoutes.create, { schema: itemSchema, body })

export const updateItem = (id: string, body: ItemInput) =>
  httpResource(itemRoutes.update(id), { schema: itemSchema, body })

export const deleteItem = (id: string) => httpResource(itemRoutes.remove(id), { schema: v.undefined() })
