import { Select as BaseSelect } from '@base-ui/react/select'
import { CheckIcon, ChevronDownIcon } from '@ui/icons'
import { inputVariants } from '@ui/input.variants'
import { cx, menuItem, popupSurface } from '@ui/variants'

export type SelectOption = { value: string; label: string }

export type SelectProps = {
  options: readonly SelectOption[]
  value: string | null
  onValueChange: (value: string) => void
  placeholder?: string
  name?: string
  id?: string
  disabled?: boolean
  className?: string
}

export const Select = ({ options, value, onValueChange, placeholder, className, ...props }: SelectProps) => (
  <BaseSelect.Root
    items={options}
    value={value}
    onValueChange={(next) => {
      if (next !== null) onValueChange(next)
    }}
    {...props}
  >
    <BaseSelect.Trigger
      data-slot="select-trigger"
      className={inputVariants({ className: cx('flex items-center justify-between gap-2 text-left', className) })}
    >
      <BaseSelect.Value placeholder={placeholder} className="truncate data-placeholder:text-muted" />
      <BaseSelect.Icon className="text-muted">
        <ChevronDownIcon />
      </BaseSelect.Icon>
    </BaseSelect.Trigger>
    <BaseSelect.Portal>
      <BaseSelect.Positioner sideOffset={6} alignItemWithTrigger={false} className="z-50 outline-none">
        <BaseSelect.Popup data-slot="select-popup" className={cx(popupSurface, 'min-w-(--anchor-width) p-1')}>
          <BaseSelect.List>
            {options.map((option) => (
              <BaseSelect.Item key={option.value} value={option.value} className={cx(menuItem, 'justify-between')}>
                <BaseSelect.ItemText>{option.label}</BaseSelect.ItemText>
                <BaseSelect.ItemIndicator className="text-primary">
                  <CheckIcon />
                </BaseSelect.ItemIndicator>
              </BaseSelect.Item>
            ))}
          </BaseSelect.List>
        </BaseSelect.Popup>
      </BaseSelect.Positioner>
    </BaseSelect.Portal>
  </BaseSelect.Root>
)
