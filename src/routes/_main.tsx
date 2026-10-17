import { useLingui } from '@lingui/react/macro'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { APP_VERSION } from '@core/constants'
import { profileQuery } from '@core/queries'
import { isAuthenticated } from '@core/session-store'
import { useSidebarStore } from '@core/sidebar-store'
import { HomeIcon, ListIcon, SettingsIcon } from '@ui/icons'
import { MainLayout, type MainNavItem } from '@layouts/main-layout'
import { UserMenu } from '@features/profile/user-menu'

const MainRoute = () => {
  const { t } = useLingui()
  const collapsed = useSidebarStore((state) => state.collapsed)
  const toggle = useSidebarStore((state) => state.toggle)
  const nav: MainNavItem[] = [
    { to: '/dashboard', label: t`Visão geral`, icon: <HomeIcon /> },
    { to: '/items', label: t`Itens`, icon: <ListIcon /> },
    { to: '/settings', label: t`Configurações`, icon: <SettingsIcon /> },
  ]

  return (
    <MainLayout
      nav={nav}
      userMenu={<UserMenu />}
      appVersion={APP_VERSION}
      sidebarCollapsed={collapsed}
      onToggleSidebar={toggle}
    >
      <Outlet />
    </MainLayout>
  )
}

export const Route = createFileRoute('/_main')({
  beforeLoad: async ({ context, location }) => {
    if (!isAuthenticated()) throw redirect({ to: '/login', search: { redirect: location.href } })
    const profile = await context.queryClient.query(profileQuery())
    if (!profile.onboarded) throw redirect({ to: '/welcome' })
  },
  component: MainRoute,
})
