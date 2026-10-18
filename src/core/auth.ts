import type { SignInRequest, SignUpRequest } from '@contracts/auth'
import { fetchSession, signIn, signOut, signUp } from '@core/api/auth'
import { useSessionStore } from '@core/session-store'

export const initializeAuth = async () => {
  const { setAuthenticated, clearSession } = useSessionStore.getState()
  const session = await fetchSession().catch(() => null)
  if (session) setAuthenticated()
  else clearSession()
}

export const signInWithPassword = async (input: SignInRequest) => {
  await signIn(input)
  useSessionStore.getState().setAuthenticated()
}

export const signUpWithPassword = async (input: SignUpRequest) => {
  await signUp(input)
  useSessionStore.getState().setAuthenticated()
}

export const signOutSession = async () => {
  await signOut().catch(() => undefined)
  useSessionStore.getState().clearSession()
}
