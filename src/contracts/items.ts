import * as v from 'valibot'

export const ITEM_STATUSES = ['draft', 'active', 'archived'] as const

export const ITEM_SORT_FIELDS = ['name', 'status', 'quantity', 'updatedAt'] as const

export const ITEM_NAME_MAX = 80

export const ITEM_DESCRIPTION_MAX = 500

export const ITEM_SEARCH_MAX = 100

export const ITEM_PAGE_SIZE_MAX = 100

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

export const itemInputSchema = v.object({
  name: v.pipe(v.string(), v.trim(), v.nonEmpty(), v.maxLength(ITEM_NAME_MAX)),
  description: v.pipe(v.string(), v.trim(), v.maxLength(ITEM_DESCRIPTION_MAX)),
  status: v.picklist(ITEM_STATUSES),
  quantity: v.pipe(v.number(), v.integer(), v.minValue(0)),
})

export type Item = v.InferOutput<typeof itemSchema>

export type ItemStatus = Item['status']

export type ItemPage = v.InferOutput<typeof itemPageSchema>

export type ItemSortField = (typeof ITEM_SORT_FIELDS)[number]

export type ItemInput = v.InferOutput<typeof itemInputSchema>

export type ItemListParams = {
  page: number
  pageSize: number
  sort: ItemSortField
  order: 'asc' | 'desc'
  q: string
}
