import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { useEffect, useMemo, type ReactNode } from 'react'
import { signInWithPassword, signOutSession, signUpWithPassword } from '@core/auth'
import { AuthContext, type AuthContextValue } from '@core/auth-context'
import { useSessionStore } from '@core/session-store'

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const status = useSessionStore((state) => state.status)
  const router = useRouter()
  const queryClient = useQueryClient()

  useEffect(
    () =>
      useSessionStore.subscribe((state, previous) => {
        if (state.status === previous.status) return
        if (state.status === 'anonymous') queryClient.clear()
        void router.invalidate()
      }),
    [router, queryClient],
  )

  const value = useMemo<AuthContextValue>(
    () => ({ status, signIn: signInWithPassword, signUp: signUpWithPassword, signOut: signOutSession }),
    [status],
  )

  return <AuthContext value={value}>{children}</AuthContext>
}
