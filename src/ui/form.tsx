import { Field } from '@base-ui/react/field'
import type { ComponentProps } from 'react'
import { cx, type WithClassName } from '@ui/variants'

export const FormField = ({ className, ...props }: WithClassName<ComponentProps<typeof Field.Root>>) => (
  <Field.Root data-slot="form-field" className={cx('flex flex-col gap-1.5', className)} {...props} />
)

export const FormLabel = ({ className, ...props }: WithClassName<ComponentProps<typeof Field.Label>>) => (
  <Field.Label data-slot="form-label" className={cx('text-sm font-medium', className)} {...props} />
)

export const FormDescription = ({
  className,
  ...props
}: WithClassName<ComponentProps<typeof Field.Description>>) => (
  <Field.Description data-slot="form-description" className={cx('text-xs text-muted', className)} {...props} />
)

export const FormError = ({ className, ...props }: WithClassName<ComponentProps<typeof Field.Error>>) => (
  <Field.Error data-slot="form-error" className={cx('text-xs font-medium text-danger', className)} {...props} />
)
