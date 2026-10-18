import * as v from 'valibot'

export const metricsSchema = v.object({
  totalItems: v.number(),
  activeItems: v.number(),
  draftItems: v.number(),
  archivedItems: v.number(),
})

export type Metrics = v.InferOutput<typeof metricsSchema>
