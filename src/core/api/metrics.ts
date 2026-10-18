import { metricsSchema } from '@contracts/metrics'
import { defineApiRoute, httpResource } from '@core/http-resource'

export const metricsRoutes = {
  summary: defineApiRoute('GET', '/metrics/summary'),
}

export const fetchMetrics = (signal?: AbortSignal) => httpResource(metricsRoutes.summary, { schema: metricsSchema, signal })
