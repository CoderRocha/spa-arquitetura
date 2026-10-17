export const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api'

export const APP_VERSION = __APP_VERSION__

export const LOCALES = ['pt-BR', 'en'] as const

export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'pt-BR'

export const TOKEN_REFRESH_MARGIN_MS = 30_000

export const DEFAULT_PAGE_SIZE = 20
