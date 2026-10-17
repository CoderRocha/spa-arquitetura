import { QueryClient } from '@tanstack/react-query'
import { isFriendlyError } from '@core/http-resource'

const isClientError = (error: unknown) => isFriendlyError(error) && error.status >= 400 && error.status < 500

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        retry: (failureCount, error) => failureCount < 2 && !isClientError(error),
      },
    },
  })
