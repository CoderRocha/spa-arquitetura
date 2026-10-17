import type { ComponentProps } from 'react'
import { cx } from '@ui/variants'

export const Table = ({ className, ...props }: ComponentProps<'table'>) => (
  <table data-slot="table" className={cx('w-full caption-bottom border-collapse text-sm', className)} {...props} />
)

export const TableHeader = ({ className, ...props }: ComponentProps<'thead'>) => (
  <thead data-slot="table-header" className={cx('bg-surface-muted/60', className)} {...props} />
)

export const TableBody = ({ className, ...props }: ComponentProps<'tbody'>) => (
  <tbody data-slot="table-body" className={className} {...props} />
)

export const TableRow = ({ className, ...props }: ComponentProps<'tr'>) => (
  <tr
    data-slot="table-row"
    className={cx('border-b border-border transition-colors hover:bg-surface-muted/50', className)}
    {...props}
  />
)

export const TableHead = ({ className, ...props }: ComponentProps<'th'>) => (
  <th
    data-slot="table-head"
    className={cx('h-10 px-3 text-left align-middle text-xs font-medium tracking-wide text-muted uppercase', className)}
    {...props}
  />
)

export const TableCell = ({ className, ...props }: ComponentProps<'td'>) => (
  <td data-slot="table-cell" className={cx('px-3 align-middle', className)} {...props} />
)
