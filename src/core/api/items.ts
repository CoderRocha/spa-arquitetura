import * as v from 'valibot'
import { itemPageSchema, itemSchema, type ItemInput, type ItemListParams } from '@contracts/items'
import { defineApiRoute, defineApiRouteFn, httpResource } from '@core/http-resource'

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
