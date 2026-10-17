import type { ComponentProps } from 'react'
import { cx } from '@ui/variants'

export const Header = ({ className, ...props }: ComponentProps<'header'>) => (
  <header
    data-slot="header"
    className={cx(
      'sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-surface/85 px-4 backdrop-blur',
      className,
    )}
    {...props}
  />
)

export const PageHeader = ({ className, ...props }: ComponentProps<'div'>) => (
  <div
    data-slot="page-header"
    className={cx('flex flex-wrap items-end justify-between gap-4 pb-6', className)}
    {...props}
  />
)

export const PageTitle = ({ className, children, ...props }: ComponentProps<'h1'>) => (
  <h1 data-slot="page-title" className={cx('text-2xl font-semibold tracking-tight', className)} {...props}>
    {children}
  </h1>
)

export const PageDescription = ({ className, ...props }: ComponentProps<'p'>) => (
  <p data-slot="page-description" className={cx('mt-1 text-sm text-muted', className)} {...props} />
)
