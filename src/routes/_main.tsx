import { useLingui } from '@lingui/react/macro'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { HouseIcon, ListIcon, SettingsIcon } from 'lucide-react'
import { APP_VERSION } from '@core/constants'
import { profileQuery } from '@core/queries'
import { isAuthenticated } from '@core/session-store'
import { useSidebarStore } from '@core/sidebar-store'
import { MainLayout, type MainNavItem } from '@layouts/main-layout'
import { UserMenu } from '@features/profile/user-menu'

const MainRoute = () => {
  const { t } = useLingui()
  const sidebarOpen = useSidebarStore((state) => state.open)
  const setSidebarOpen = useSidebarStore((state) => state.setOpen)
  const nav: MainNavItem[] = [
    { to: '/dashboard', label: t`Visão geral`, icon: <HouseIcon /> },
    { to: '/items', label: t`Itens`, icon: <ListIcon /> },
    { to: '/settings', label: t`Configurações`, icon: <SettingsIcon /> },
  ]

  return (
    <MainLayout
      nav={nav}
      userMenu={<UserMenu />}
      appVersion={APP_VERSION}
      sidebarOpen={sidebarOpen}
      onSidebarOpenChange={setSidebarOpen}
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
