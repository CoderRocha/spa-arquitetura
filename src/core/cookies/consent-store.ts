import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export type Consent = 'pending' | 'granted' | 'denied'

type ConsentState = {
  consent: Consent
  setConsent: (consent: Exclude<Consent, 'pending'>) => void
}

export const useConsentStore = create<ConsentState>()(
  persist(
    (set) => ({
      consent: 'pending',
      setConsent: (consent) => {
        set({ consent })
      },
    }),
    {
      name: 'cookie-consent',
      storage: createJSONStorage(() => localStorage),
      partialize: ({ consent }) => ({ consent }),
    },
  ),
)
