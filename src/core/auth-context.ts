import { createContext, use } from 'react'
import type { SignInRequest, SignUpRequest } from '@contracts/auth'
import type { SessionStatus } from '@core/session-store'

export type AuthContextValue = {
  status: SessionStatus
  signIn: (input: SignInRequest) => Promise<void>
  signUp: (input: SignUpRequest) => Promise<void>
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export const useAuth = () => {
  const value = use(AuthContext)
  if (!value) throw new Error('useAuth must be used within <AuthProvider>')
  return value
}
