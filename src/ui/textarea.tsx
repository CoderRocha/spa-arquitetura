import { Field } from '@base-ui/react/field'
import type { ComponentProps } from 'react'
import { inputVariants } from '@ui/input.variants'

export type TextareaProps = Omit<ComponentProps<typeof Field.Control>, 'className' | 'render'> & {
  className?: string
  rows?: number
}

export const Textarea = ({ className, rows = 4, ...props }: TextareaProps) => (
  <Field.Control
    data-slot="textarea"
    render={<textarea rows={rows} />}
    className={inputVariants({ size: 'multiline', className })}
    {...props}
  />
)
