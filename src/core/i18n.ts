import { i18n, type Messages } from '@lingui/core'
import { useAppStore } from '@core/app-store'
import type { Locale } from '@core/constants'

const catalogs: Record<Locale, () => Promise<{ messages: Messages }>> = {
  'pt-BR': () => import('@core/locales/pt-BR.po'),
  en: () => import('@core/locales/en.po'),
}

export const loadLocale = async (locale: Locale) => {
  const { messages } = await catalogs[locale]()
  i18n.loadAndActivate({ locale, messages })
  document.documentElement.lang = locale
}

export const initializeI18n = () => loadLocale(useAppStore.getState().locale)

export const changeLocale = async (locale: Locale) => {
  await loadLocale(locale)
  useAppStore.getState().setLocale(locale)
}
