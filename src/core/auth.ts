import { signIn, signOut, signUp, type SignInRequest, type SignUpRequest } from '@core/api/auth'
import { refreshSessionIfNeeded } from '@core/http-resource'
import { useSessionStore } from '@core/session-store'

export const initializeAuth = async () => {
  await refreshSessionIfNeeded()
  const { tokens, setSession, clearSession } = useSessionStore.getState()
  if (tokens) setSession(tokens)
  else clearSession()
}

export const signInWithPassword = async (input: SignInRequest) => {
  useSessionStore.getState().setSession(await signIn(input))
}

export const signUpWithPassword = async (input: SignUpRequest) => {
  useSessionStore.getState().setSession(await signUp(input))
}

export const signOutSession = async () => {
  await signOut().catch(() => undefined)
  useSessionStore.getState().clearSession()
}
