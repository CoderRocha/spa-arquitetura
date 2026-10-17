import { useLingui } from '@lingui/react/macro'
import { Link, type LinkProps } from '@tanstack/react-router'
import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { Button } from '@ui/button'
import { Header } from '@ui/header'
import { PanelIcon } from '@ui/icons'
import { ScrollArea } from '@ui/scroll-area'
import { Tooltip } from '@ui/tooltip'
import { cx } from '@ui/variants'

export type MainNavItem = {
  to: LinkProps['to']
  label: string
  icon: ReactNode
}

type MainLayoutProps = {
  nav: readonly MainNavItem[]
  userMenu: ReactNode
  appVersion: string
  sidebarCollapsed: boolean
  onToggleSidebar: () => void
  children: ReactNode
}

export const MainLayout = ({
  nav,
  userMenu,
  appVersion,
  sidebarCollapsed,
  onToggleSidebar,
  children,
}: MainLayoutProps) => {
  const { t } = useLingui()
  return (
    <div className="flex min-h-dvh">
      <motion.aside
        initial={false}
        animate={{ width: sidebarCollapsed ? 68 : 232 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className="sticky top-0 flex h-dvh shrink-0 flex-col overflow-hidden border-r border-border bg-surface"
      >
        <div className="flex h-14 items-center px-5 text-base font-semibold tracking-tight">
          {sidebarCollapsed ? 'W' : 'Workspace'}
        </div>
        <nav aria-label={t`Navegação principal`} className="flex flex-1 flex-col gap-1 p-3">
          {nav.map((item) => {
            const link = (
              <Link
                to={item.to}
                className={cx(
                  'flex h-10 items-center gap-3 rounded-control px-3 text-sm font-medium text-muted transition-colors hover:bg-surface-muted hover:text-foreground [&_svg]:size-4.5 [&_svg]:shrink-0',
                  'data-[status=active]:bg-primary/10 data-[status=active]:text-primary',
                )}
              >
                {item.icon}
                <span className={cx(sidebarCollapsed && 'sr-only')}>{item.label}</span>
              </Link>
            )
            return sidebarCollapsed ? (
              <Tooltip key={item.label} content={item.label} side="right">
                {link}
              </Tooltip>
            ) : (
              <div key={item.label}>{link}</div>
            )
          })}
        </nav>
        <p className={cx('px-5 py-4 text-xs text-muted', sidebarCollapsed && 'sr-only')}>v{appVersion}</p>
      </motion.aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <Header>
          <Button
            variant="ghost"
            size="icon"
            aria-label={sidebarCollapsed ? t`Expandir menu` : t`Recolher menu`}
            aria-pressed={sidebarCollapsed}
            onClick={onToggleSidebar}
          >
            <PanelIcon />
          </Button>
          <div className="ml-auto">{userMenu}</div>
        </Header>
        <ScrollArea className="flex-1">
          <main className="mx-auto w-full max-w-6xl p-6">{children}</main>
        </ScrollArea>
      </div>
    </div>
  )
}
