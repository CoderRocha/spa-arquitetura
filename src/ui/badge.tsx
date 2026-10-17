import type { VariantProps } from 'cva'
import type { ComponentProps } from 'react'
import { cva } from '@ui/variants'

export const badgeVariants = cva({
  base: 'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap',
  variants: {
    tone: {
      neutral: 'bg-surface-muted text-muted',
      info: 'bg-primary/10 text-primary',
      success: 'bg-success-surface text-success',
      warning: 'bg-warning-surface text-warning',
      danger: 'bg-danger-surface text-danger',
    },
  },
  defaultVariants: {
    tone: 'neutral',
  },
})

export type BadgeProps = ComponentProps<'span'> & VariantProps<typeof badgeVariants>

export const Badge = ({ tone = 'neutral', className, ...props }: BadgeProps) => (
  <span data-slot="badge" data-variant={tone} className={badgeVariants({ tone, className })} {...props} />
)
