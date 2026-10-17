import { keepPreviousData, queryOptions } from '@tanstack/react-query'
import { fetchItem, fetchItems, type ItemListParams } from '@core/api/items'
import { fetchMetrics } from '@core/api/metrics'
import { fetchProfile } from '@core/api/profile'
import { keys } from '@core/keys'

export const itemListQuery = (params: ItemListParams) =>
  queryOptions({
    queryKey: keys.items.list(params).queryKey,
    queryFn: ({ signal }) => fetchItems(params, signal),
    placeholderData: keepPreviousData,
  })

export const itemDetailQuery = (id: string) =>
  queryOptions({
    queryKey: keys.items.detail(id).queryKey,
    queryFn: ({ signal }) => fetchItem(id, signal),
  })

export const profileQuery = () =>
  queryOptions({
    queryKey: keys.profile.current.queryKey,
    queryFn: ({ signal }) => fetchProfile(signal),
    staleTime: 5 * 60_000,
    gcTime: 30 * 60_000,
  })

export const metricsQuery = () =>
  queryOptions({
    queryKey: keys.metrics.summary.queryKey,
    queryFn: ({ signal }) => fetchMetrics(signal),
    select: (metrics) => ({
      ...metrics,
      activeRatio: metrics.totalItems === 0 ? 0 : metrics.activeItems / metrics.totalItems,
    }),
  })
