import { create } from 'zustand'

export type SessionStatus = 'unknown' | 'authenticated' | 'anonymous'

type SessionState = {
  status: SessionStatus
  setAuthenticated: () => void
  clearSession: () => void
}

export const useSessionStore = create<SessionState>()((set) => ({
  status: 'unknown',
  setAuthenticated: () => {
    set({ status: 'authenticated' })
  },
  clearSession: () => {
    set({ status: 'anonymous' })
  },
}))

export const isAuthenticated = () => useSessionStore.getState().status === 'authenticated'
