import { Tabs as BaseTabs } from '@base-ui/react/tabs'
import type { ComponentProps } from 'react'
import { cx, type WithClassName } from '@ui/variants'

export const Tabs = ({ className, ...props }: WithClassName<ComponentProps<typeof BaseTabs.Root>>) => (
  <BaseTabs.Root data-slot="tabs" className={cx('flex flex-col gap-6', className)} {...props} />
)

export const TabsList = ({ className, children, ...props }: WithClassName<ComponentProps<typeof BaseTabs.List>>) => (
  <BaseTabs.List
    data-slot="tabs-list"
    className={cx('relative flex gap-1 border-b border-border', className)}
    {...props}
  >
    {children}
    <BaseTabs.Indicator className="absolute bottom-0 left-(--active-tab-left) h-0.5 w-(--active-tab-width) bg-primary transition-all duration-200" />
  </BaseTabs.List>
)

export const TabsTab = ({ className, ...props }: WithClassName<ComponentProps<typeof BaseTabs.Tab>>) => (
  <BaseTabs.Tab
    data-slot="tabs-tab"
    className={cx(
      'cursor-pointer px-3 pb-2.5 text-sm font-medium text-muted transition-colors outline-none hover:text-foreground data-active:text-foreground',
      className,
    )}
    {...props}
  />
)

export const TabsPanel = ({ className, ...props }: WithClassName<ComponentProps<typeof BaseTabs.Panel>>) => (
  <BaseTabs.Panel data-slot="tabs-panel" className={cx('outline-none', className)} {...props} />
)
