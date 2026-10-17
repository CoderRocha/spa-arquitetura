import { Popover as BasePopover } from '@base-ui/react/popover'
import type { ComponentProps } from 'react'
import { cx, popupSurface, type WithClassName } from '@ui/variants'

export const Popover = BasePopover.Root

export const PopoverTrigger = BasePopover.Trigger

export type PopoverContentProps = WithClassName<ComponentProps<typeof BasePopover.Popup>> & {
  side?: 'top' | 'bottom' | 'left' | 'right'
  align?: 'start' | 'center' | 'end'
}

export const PopoverContent = ({ className, side = 'bottom', align = 'center', ...props }: PopoverContentProps) => (
  <BasePopover.Portal>
    <BasePopover.Positioner side={side} align={align} sideOffset={8} className="z-50">
      <BasePopover.Popup data-slot="popover" className={cx(popupSurface, 'w-72 p-4', className)} {...props} />
    </BasePopover.Positioner>
  </BasePopover.Portal>
)
