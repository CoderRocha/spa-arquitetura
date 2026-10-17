import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { isAuthenticated } from '@core/session-store'
import { OnboardingLayout } from '@layouts/onboarding-layout'

const OnboardingRoute = () => (
  <OnboardingLayout>
    <Outlet />
  </OnboardingLayout>
)

export const Route = createFileRoute('/_onboarding')({
  beforeLoad: ({ location }) => {
    if (!isAuthenticated()) throw redirect({ to: '/login', search: { redirect: location.href } })
  },
  component: OnboardingRoute,
})
