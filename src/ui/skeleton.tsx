import type { ComponentProps } from 'react'
import { cx } from '@ui/variants'

export const Skeleton = ({ className, ...props }: ComponentProps<'div'>) => (
  <div
    data-slot="skeleton"
    aria-hidden="true"
    className={cx('animate-pulse rounded-control bg-surface-muted', className)}
    {...props}
  />
)
