import type { AnyRouter } from '@tanstack/react-router'
import { useConsentStore } from '@core/cookies/consent-store'

export const trackPageView = (path: string) => {
  if (useConsentStore.getState().consent !== 'granted') return
  // ponytail: console sink, plug the real analytics client here when one exists
  if (import.meta.env.DEV) console.info('[analytics] page_view', path)
}

export const startRouteTracking = (router: AnyRouter) =>
  router.subscribe('onResolved', ({ toLocation }) => {
    trackPageView(toLocation.pathname)
  })
