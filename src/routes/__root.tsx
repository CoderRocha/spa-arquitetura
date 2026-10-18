import { useLingui } from '@lingui/react/macro'
import type { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, HeadContent, Outlet } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'
import { AuthProvider } from '@core/auth-provider'
import { Toaster } from '@ui/sonner'
import { TooltipProvider } from '@ui/tooltip'
import { CookieConsentBanner } from '@pattern/cookie-consent-banner'
import { ErrorFallback } from '@pattern/widget-boundary'
import { NotFoundPage } from '@layouts/pages/not-found-page'

export type RouterContext = {
  queryClient: QueryClient
}

const showDevtools = import.meta.env.DEV && import.meta.env.MODE !== 'test'

const Devtools = lazy(() => import('@core/devtools'))

const RootComponent = () => {
  const { t } = useLingui()
  return (
    <AuthProvider>
      <HeadContent />
      <TooltipProvider>
        <Outlet />
      </TooltipProvider>
      <CookieConsentBanner />
      <Toaster containerAriaLabel={t`Notificações`} />
      {showDevtools && (
        <Suspense>
          <Devtools />
        </Suspense>
      )}
    </AuthProvider>
  )
}

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({ meta: [{ title: 'Boilerplate SPA' }] }),
  component: RootComponent,
  notFoundComponent: NotFoundPage,
  errorComponent: ErrorFallback,
})
