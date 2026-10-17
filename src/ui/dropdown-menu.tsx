import { Menu } from '@base-ui/react/menu'
import type { ComponentProps } from 'react'
import { cx, menuItem, popupSurface, type WithClassName } from '@ui/variants'

export const DropdownMenu = Menu.Root

export const DropdownMenuTrigger = Menu.Trigger

export type DropdownMenuContentProps = WithClassName<ComponentProps<typeof Menu.Popup>> & {
  align?: 'start' | 'center' | 'end'
}

export const DropdownMenuContent = ({ className, align = 'end', ...props }: DropdownMenuContentProps) => (
  <Menu.Portal>
    <Menu.Positioner align={align} sideOffset={6} className="z-50">
      <Menu.Popup data-slot="dropdown-menu" className={cx(popupSurface, 'min-w-48 p-1', className)} {...props} />
    </Menu.Positioner>
  </Menu.Portal>
)

export const DropdownMenuItem = ({ className, ...props }: WithClassName<ComponentProps<typeof Menu.Item>>) => (
  <Menu.Item data-slot="dropdown-menu-item" className={cx(menuItem, className)} {...props} />
)

export const DropdownMenuLabel = ({ className, ...props }: ComponentProps<'div'>) => (
  <div data-slot="dropdown-menu-label" className={cx('px-2 py-1.5 text-xs text-muted', className)} {...props} />
)
