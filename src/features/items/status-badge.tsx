import { useLingui } from '@lingui/react/macro'
import type { ItemStatus } from '@core/api/items'
import { Badge, type BadgeProps } from '@ui/badge'

const tones = {
  draft: 'neutral',
  active: 'success',
  archived: 'warning',
} as const satisfies Record<ItemStatus, BadgeProps['tone']>

export const useItemStatusLabels = (): Record<ItemStatus, string> => {
  const { t } = useLingui()
  return { draft: t`Rascunho`, active: t`Ativo`, archived: t`Arquivado` }
}

export const ItemStatusBadge = ({ status }: { status: ItemStatus }) => {
  const labels = useItemStatusLabels()
  return <Badge tone={tones[status]}>{labels[status]}</Badge>
}
