import type { ComponentProps } from 'react'
import { cx } from '@ui/variants'

export const Card = ({ className, ...props }: ComponentProps<'section'>) => (
  <section
    data-slot="card"
    className={cx('rounded-card border border-border bg-surface p-5 shadow-xs', className)}
    {...props}
  />
)

export const CardHeader = ({ className, ...props }: ComponentProps<'div'>) => (
  <div data-slot="card-header" className={cx('mb-4 flex flex-col gap-1', className)} {...props} />
)

export const CardTitle = ({ className, children, ...props }: ComponentProps<'h2'>) => (
  <h2 data-slot="card-title" className={cx('text-base font-semibold', className)} {...props}>
    {children}
  </h2>
)

export const CardDescription = ({ className, ...props }: ComponentProps<'p'>) => (
  <p data-slot="card-description" className={cx('text-sm text-muted', className)} {...props} />
)
