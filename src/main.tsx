import '@/styles.css'
import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from '@tanstack/react-router'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { startRouteTracking } from '@core/analytics/tracking'
import { initializeAuth } from '@core/auth'
import { initializeI18n } from '@core/i18n'
import { createQueryClient } from '@/query-client'
import { createAppRouter } from '@/router'

const enableMocks = async () => {
  if (!import.meta.env.DEV || import.meta.env.MODE !== 'mock') return
  const { worker } = await import('@mocks/browser')
  await worker.start({ onUnhandledFrame: 'bypass' })
}

const bootstrap = async () => {
  await enableMocks()
  await initializeAuth()
  await initializeI18n()

  const queryClient = createQueryClient()
  const router = createAppRouter(queryClient)
  startRouteTracking(router)

  const container = document.getElementById('root')
  if (!container) throw new Error('Missing #root element')

  createRoot(container).render(
    <StrictMode>
      <I18nProvider i18n={i18n}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </I18nProvider>
    </StrictMode>,
  )
}

void bootstrap()
