import type { ReactNode } from 'react'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@ui/empty'

type EmptyStateProps = {
  title: string
  description: string
  action?: ReactNode
}

export const EmptyState = ({ title, description, action }: EmptyStateProps) => (
  <Empty>
    <EmptyHeader>
      <EmptyTitle>{title}</EmptyTitle>
      <EmptyDescription>{description}</EmptyDescription>
    </EmptyHeader>
    {action && <EmptyContent>{action}</EmptyContent>}
  </Empty>
)
