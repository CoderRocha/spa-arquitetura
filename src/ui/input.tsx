import { Input as BaseInput } from '@base-ui/react/input'
import type { ComponentProps } from 'react'
import { inputVariants } from '@ui/input.variants'

export type InputProps = Omit<ComponentProps<typeof BaseInput>, 'className' | 'size'> & {
  className?: string
  size?: 'sm' | 'md'
}

export const Input = ({ size = 'md', className, ...props }: InputProps) => (
  <BaseInput data-slot="input" data-size={size} className={inputVariants({ size, className })} {...props} />
)
