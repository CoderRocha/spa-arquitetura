import type { VariantProps } from 'cva'
import type { ComponentProps } from 'react'
import { buttonVariants } from '@ui/button.variants'

export type ButtonProps = ComponentProps<'button'> & VariantProps<typeof buttonVariants>

export const Button = ({ variant = 'primary', size = 'md', type = 'button', className, ...props }: ButtonProps) => (
  <button
    data-slot="button"
    data-variant={variant}
    data-size={size}
    type={type}
    className={buttonVariants({ variant, size, className })}
    {...props}
  />
)
