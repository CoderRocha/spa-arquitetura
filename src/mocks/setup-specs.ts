import { cleanup, configure } from '@testing-library/react'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { useConsentStore } from '@core/cookies/consent-store'
import { loadLocale } from '@core/i18n'
import { useSessionStore } from '@core/session-store'
import { resetDb } from '@mocks/db'
import { server } from '@mocks/server'

configure({ asyncUtilTimeout: 5_000 })

// jsdom has no layout engine; a fixed box lets TanStack Virtual render rows
Object.defineProperties(HTMLElement.prototype, {
  offsetHeight: { configurable: true, get: () => 800 },
  offsetWidth: { configurable: true, get: () => 1200 },
})
await loadLocale('pt-BR')
useConsentStore.getState().setConsent('denied')

beforeAll(() => {
  server.listen({ onUnhandledFrame: 'error' })
})

afterEach(() => {
  cleanup()
  server.resetHandlers()
  resetDb()
  localStorage.clear()
  useSessionStore.getState().clearSession()
  useConsentStore.getState().setConsent('denied')
})

afterAll(() => {
  server.close()
})
