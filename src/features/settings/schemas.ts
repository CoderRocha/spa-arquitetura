import * as v from 'valibot'
import { LOCALES } from '@core/constants'

export const preferencesSchema = v.object({
  locale: v.picklist(LOCALES),
})

export type PreferencesValues = v.InferInput<typeof preferencesSchema>
