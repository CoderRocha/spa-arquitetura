import * as v from 'valibot'
import { defineApiRoute, httpResource } from '@core/http-resource'
import { sessionTokensSchema } from '@core/session-store'

export type SignInRequest = { email: string; password: string }

export type SignUpRequest = { name: string; email: string; password: string }

export const authRoutes = {
  signIn: defineApiRoute('POST', '/auth/sign-in'),
  signUp: defineApiRoute('POST', '/auth/sign-up'),
  signOut: defineApiRoute('POST', '/auth/sign-out'),
}

export const signIn = (body: SignInRequest) =>
  httpResource(authRoutes.signIn, { body, schema: sessionTokensSchema, auth: false })

export const signUp = (body: SignUpRequest) =>
  httpResource(authRoutes.signUp, { body, schema: sessionTokensSchema, auth: false })

export const signOut = () => httpResource(authRoutes.signOut, { schema: v.undefined() })
