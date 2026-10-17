import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { DEFAULT_LOCALE, type Locale } from '@core/constants'

type AppState = {
  locale: Locale
  setLocale: (locale: Locale) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      locale: DEFAULT_LOCALE,
      setLocale: (locale) => {
        set({ locale })
      },
    }),
    {
      name: 'app',
      storage: createJSONStorage(() => localStorage),
      partialize: ({ locale }) => ({ locale }),
    },
  ),
)
