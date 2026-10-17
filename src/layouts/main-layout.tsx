import { useLingui } from '@lingui/react/macro'
import { Link, useMatchRoute, type LinkProps } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from '@ui/sidebar'

export type MainNavItem = {
  to: LinkProps['to']
  label: string
  icon: ReactNode
}

const NavMenu = ({ nav }: { nav: readonly MainNavItem[] }) => {
  const matchRoute = useMatchRoute()
  const { isMobile, setOpenMobile } = useSidebar()
  return (
    <SidebarMenu>
      {nav.map((item) => (
        <SidebarMenuItem key={item.label}>
          <SidebarMenuButton
            isActive={Boolean(matchRoute({ to: item.to, fuzzy: true }))}
            tooltip={item.label}
            render={<Link to={item.to} />}
            onClick={() => {
              if (isMobile) setOpenMobile(false)
            }}
          >
            {item.icon}
            <span>{item.label}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}

type MainLayoutProps = {
  nav: readonly MainNavItem[]
  userMenu: ReactNode
  appVersion: string
  sidebarOpen: boolean
  onSidebarOpenChange: (open: boolean) => void
  children: ReactNode
}

export const MainLayout = ({
  nav,
  userMenu,
  appVersion,
  sidebarOpen,
  onSidebarOpenChange,
  children,
}: MainLayoutProps) => {
  const { t } = useLingui()
  const toggleLabel = t`Alternar menu`

  return (
    <SidebarProvider open={sidebarOpen} onOpenChange={onSidebarOpenChange}>
      <Sidebar collapsible="icon" label={t`Navegação principal`}>
        <SidebarHeader>
          <div className="flex h-8 items-center gap-2 px-1 font-semibold tracking-tight">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-primary text-xs text-primary-foreground">
              W
            </span>
            <span className="truncate group-data-[collapsible=icon]:hidden">Workspace</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <nav aria-label={t`Navegação principal`}>
            <SidebarGroup>
              <SidebarGroupContent>
                <NavMenu nav={nav} />
              </SidebarGroupContent>
            </SidebarGroup>
          </nav>
        </SidebarContent>
        <SidebarFooter>
          <p className="px-2 text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">v{appVersion}</p>
        </SidebarFooter>
        <SidebarRail label={toggleLabel} />
      </Sidebar>
      <SidebarInset className="min-w-0">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b bg-background/85 px-4 backdrop-blur">
          <SidebarTrigger label={toggleLabel} className="-ml-1" />
          <div className="ml-auto">{userMenu}</div>
        </header>
        <div className="mx-auto w-full max-w-6xl p-4 sm:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
