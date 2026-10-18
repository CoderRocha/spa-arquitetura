import { createQueryKeys, mergeQueryKeys } from '@lukemorales/query-key-factory'
import type { ItemListParams } from '@contracts/items'

const items = createQueryKeys('items', {
  list: (params: ItemListParams) => [params],
  detail: (id: string) => [id],
})

const profile = createQueryKeys('profile', {
  current: null,
})

const metrics = createQueryKeys('metrics', {
  summary: null,
})

export const keys = mergeQueryKeys(items, profile, metrics)
