import * as v from 'valibot'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export const sessionTokensSchema = v.object({
  accessToken: v.string(),
  refreshToken: v.string(),
  expiresAt: v.number(),
})

export type SessionTokens = v.InferOutput<typeof sessionTokensSchema>

export type SessionStatus = 'unknown' | 'authenticated' | 'anonymous'

type SessionState = {
  status: SessionStatus
  tokens: SessionTokens | null
  setSession: (tokens: SessionTokens) => void
  clearSession: () => void
}

// ponytail: tokens in localStorage keep the mock simple; with a real backend move the refresh token to an httpOnly cookie
export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      status: 'unknown',
      tokens: null,
      setSession: (tokens) => {
        set({ tokens, status: 'authenticated' })
      },
      clearSession: () => {
        set({ tokens: null, status: 'anonymous' })
      },
    }),
    {
      name: 'session',
      storage: createJSONStorage(() => localStorage),
      partialize: ({ tokens }) => ({ tokens }),
    },
  ),
)

export const isAuthenticated = () => useSessionStore.getState().status === 'authenticated'
