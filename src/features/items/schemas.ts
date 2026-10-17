import { t } from '@lingui/core/macro'
import * as v from 'valibot'
import { ITEM_SORT_FIELDS, ITEM_STATUSES } from '@core/api/items'
import { DEFAULT_PAGE_SIZE } from '@core/constants'
import { optionalText, requiredText } from '@core/schemas'

export const PAGE_SIZES = [10, 20, 50, 100] as const

export const itemSearchSchema = v.object({
  page: v.fallback(v.optional(v.pipe(v.number(), v.integer(), v.minValue(1)), 1), 1),
  pageSize: v.fallback(v.optional(v.picklist(PAGE_SIZES), DEFAULT_PAGE_SIZE), DEFAULT_PAGE_SIZE),
  sort: v.fallback(v.optional(v.picklist(ITEM_SORT_FIELDS), 'updatedAt'), 'updatedAt'),
  order: v.fallback(v.optional(v.picklist(['asc', 'desc']), 'desc'), 'desc'),
  q: v.fallback(v.optional(v.pipe(v.string(), v.trim(), v.maxLength(100)), ''), ''),
})

export type ItemSearch = v.InferOutput<typeof itemSearchSchema>

export const itemSearchDefaults: ItemSearch = v.getDefaults(itemSearchSchema)

export const itemFormSchema = v.object({
  name: requiredText(80),
  description: optionalText(500),
  status: v.picklist(ITEM_STATUSES, () => t`Selecione um status.`),
  quantity: v.pipe(
    v.number(() => t`Informe um número.`),
    v.integer(() => t`Use um número inteiro.`),
    v.minValue(0, () => t`O valor mínimo é 0.`),
  ),
})

export type ItemFormValues = v.InferInput<typeof itemFormSchema>
