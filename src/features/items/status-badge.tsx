import { useLingui } from '@lingui/react/macro'
import type { ItemStatus } from '@core/api/items'
import { Badge } from '@ui/badge'

const variants = {
  draft: 'secondary',
  active: 'success',
  archived: 'warning',
} as const

export const useItemStatusLabels = (): Record<ItemStatus, string> => {
  const { t } = useLingui()
  return { draft: t`Rascunho`, active: t`Ativo`, archived: t`Arquivado` }
}

export const ItemStatusBadge = ({ status }: { status: ItemStatus }) => {
  const labels = useItemStatusLabels()
  return <Badge variant={variants[status]}>{labels[status]}</Badge>
}
