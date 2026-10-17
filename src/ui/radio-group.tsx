import { Radio } from '@base-ui/react/radio'
import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group'
import type { ComponentProps, ReactNode } from 'react'
import { cx, type WithClassName } from '@ui/variants'

export type RadioGroupProps = WithClassName<ComponentProps<typeof BaseRadioGroup>>

export const RadioGroup = ({ className, ...props }: RadioGroupProps) => (
  <BaseRadioGroup data-slot="radio-group" className={cx('flex flex-col gap-2', className)} {...props} />
)

export type RadioGroupItemProps = {
  value: string
  children: ReactNode
  className?: string
}

export const RadioGroupItem = ({ value, children, className }: RadioGroupItemProps) => (
  <label data-slot="radio-group-item" className={cx('flex cursor-pointer items-center gap-2 text-sm', className)}>
    <Radio.Root
      value={value}
      className="flex size-5 items-center justify-center rounded-full border border-border bg-surface transition-colors data-checked:border-primary"
    >
      <Radio.Indicator className="size-2.5 rounded-full bg-primary data-unchecked:hidden" />
    </Radio.Root>
    {children}
  </label>
)
