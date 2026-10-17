import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox'
import type { ComponentProps } from 'react'
import { CheckIcon } from '@ui/icons'
import { cx, type WithClassName } from '@ui/variants'

export type CheckboxProps = WithClassName<ComponentProps<typeof BaseCheckbox.Root>>

export const Checkbox = ({ className, ...props }: CheckboxProps) => (
  <BaseCheckbox.Root
    data-slot="checkbox"
    className={cx(
      'flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-md border border-border bg-surface text-primary-foreground transition-colors data-checked:border-primary data-checked:bg-primary data-disabled:opacity-50 data-invalid:border-danger',
      className,
    )}
    {...props}
  >
    <BaseCheckbox.Indicator className="data-unchecked:hidden">
      <CheckIcon className="size-3.5" />
    </BaseCheckbox.Indicator>
  </BaseCheckbox.Root>
)
