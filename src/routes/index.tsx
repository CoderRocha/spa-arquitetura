import { createFileRoute, redirect } from '@tanstack/react-router'
import { isAuthenticated } from '@core/session-store'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    throw redirect({ to: isAuthenticated() ? '/dashboard' : '/login' })
  },
})
