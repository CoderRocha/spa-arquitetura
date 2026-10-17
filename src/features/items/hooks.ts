import { useMutation, useQueryClient, type QueryClient } from '@tanstack/react-query'
import { createItem, deleteItem, updateItem, type ItemInput } from '@core/api/items'
import { keys } from '@core/keys'
import { itemDetailQuery } from '@core/queries'

const invalidateItemViews = (queryClient: QueryClient) =>
  Promise.all([
    queryClient.invalidateQueries({ queryKey: keys.items._def }),
    queryClient.invalidateQueries({ queryKey: keys.metrics._def }),
  ])

export const useCreateItem = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createItem,
    onSuccess: () => invalidateItemViews(queryClient),
  })
}

export const useUpdateItem = (id: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: ItemInput) => updateItem(id, input),
    onSuccess: (item) => {
      queryClient.setQueryData(itemDetailQuery(id).queryKey, item)
      return invalidateItemViews(queryClient)
    },
  })
}

export const useDeleteItem = (id: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => deleteItem(id),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: itemDetailQuery(id).queryKey })
      return invalidateItemViews(queryClient)
    },
  })
}
