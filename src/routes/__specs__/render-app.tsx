import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { createMemoryHistory, RouterProvider } from '@tanstack/react-router'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { signIn } from '@core/api/auth'
import { useSessionStore } from '@core/session-store'
import { DEMO_EMAIL, DEMO_PASSWORD } from '@mocks/db'
import { createQueryClient } from '@/query-client'
import { createAppRouter } from '@/router'

export const renderApp = (path: string) => {
  const queryClient = createQueryClient()
  const router = createAppRouter(queryClient, createMemoryHistory({ initialEntries: [path] }))
  render(
    <I18nProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </I18nProvider>,
  )
  return { router, user: userEvent.setup() }
}

export const signInAsDemo = async () => {
  useSessionStore.getState().setSession(await signIn({ email: DEMO_EMAIL, password: DEMO_PASSWORD }))
}
