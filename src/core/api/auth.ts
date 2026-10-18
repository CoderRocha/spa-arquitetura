import {
  authResultSchema,
  sessionSchema,
  signOutSchema,
  type SignInRequest,
  type SignUpRequest,
} from '@contracts/auth'
import { defineApiRoute, httpResource } from '@core/http-resource'

export const authRoutes = {
  signIn: defineApiRoute('POST', '/auth/sign-in/email'),
  signUp: defineApiRoute('POST', '/auth/sign-up/email'),
  signOut: defineApiRoute('POST', '/auth/sign-out'),
  session: defineApiRoute('GET', '/auth/get-session'),
}

export const signIn = (body: SignInRequest) => httpResource(authRoutes.signIn, { body, schema: authResultSchema })

export const signUp = (body: SignUpRequest) => httpResource(authRoutes.signUp, { body, schema: authResultSchema })

export const signOut = () => httpResource(authRoutes.signOut, { body: {}, schema: signOutSchema })

export const fetchSession = () => httpResource(authRoutes.session, { schema: sessionSchema })
