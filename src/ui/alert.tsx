import type { VariantProps } from 'cva'
import type { ComponentProps } from 'react'
import { AlertIcon } from '@ui/icons'
import { cva, cx } from '@ui/variants'

export const alertVariants = cva({
  base: 'flex gap-3 rounded-card border p-4 text-sm [&>svg]:mt-0.5 [&>svg]:size-4 [&>svg]:shrink-0',
  variants: {
    tone: {
      info: 'border-primary/20 bg-primary/5 text-foreground [&>svg]:text-primary',
      danger: 'border-danger/25 bg-danger-surface text-foreground [&>svg]:text-danger',
      success: 'border-success/25 bg-success-surface text-foreground [&>svg]:text-success',
    },
  },
  defaultVariants: {
    tone: 'info',
  },
})

export type AlertProps = ComponentProps<'div'> & VariantProps<typeof alertVariants>

export const Alert = ({ tone = 'info', className, children, ...props }: AlertProps) => (
  <div
    data-slot="alert"
    data-variant={tone}
    role={tone === 'danger' ? 'alert' : 'status'}
    className={alertVariants({ tone, className })}
    {...props}
  >
    <AlertIcon />
    <div className="flex flex-col gap-1">{children}</div>
  </div>
)

export const AlertTitle = ({ className, ...props }: ComponentProps<'p'>) => (
  <p data-slot="alert-title" className={cx('font-medium', className)} {...props} />
)

export const AlertDescription = ({ className, ...props }: ComponentProps<'p'>) => (
  <p data-slot="alert-description" className={cx('text-muted', className)} {...props} />
)
