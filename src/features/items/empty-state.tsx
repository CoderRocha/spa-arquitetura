import type { ReactNode } from 'react'

type EmptyStateProps = {
  title: string
  description: string
  action?: ReactNode
}

export const EmptyState = ({ title, description, action }: EmptyStateProps) => (
  <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
    <p className="font-medium">{title}</p>
    <p className="max-w-sm text-sm text-muted">{description}</p>
    {action && <div className="mt-3">{action}</div>}
  </div>
)
