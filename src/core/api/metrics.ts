import * as v from 'valibot'
import { defineApiRoute, httpResource } from '@core/http-resource'

export const metricsSchema = v.object({
  totalItems: v.number(),
  activeItems: v.number(),
  draftItems: v.number(),
  archivedItems: v.number(),
})

export type Metrics = v.InferOutput<typeof metricsSchema>

export const metricsRoutes = {
  summary: defineApiRoute('GET', '/metrics/summary'),
}

export const fetchMetrics = (signal?: AbortSignal) => httpResource(metricsRoutes.summary, { schema: metricsSchema, signal })
