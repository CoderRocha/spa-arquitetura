import { createFileRoute, Outlet } from '@tanstack/react-router'
import { APP_VERSION } from '@core/constants'
import { AuthLayout } from '@layouts/auth-layout'

const AuthRoute = () => (
  <AuthLayout appVersion={APP_VERSION}>
    <Outlet />
  </AuthLayout>
)

export const Route = createFileRoute('/_auth')({
  component: AuthRoute,
})
