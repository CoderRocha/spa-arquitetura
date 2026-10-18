import * as v from 'valibot'

export const PASSWORD_MIN = 8

export const PASSWORD_MAX = 128

export const authUserSchema = v.object({
  id: v.string(),
  name: v.string(),
  email: v.string(),
})

export const authResultSchema = v.object({
  user: authUserSchema,
})

export const sessionSchema = v.nullable(
  v.object({
    user: authUserSchema,
  }),
)

export const signOutSchema = v.object({
  success: v.boolean(),
})

export type AuthUser = v.InferOutput<typeof authUserSchema>

export type SignInRequest = { email: string; password: string }

export type SignUpRequest = { name: string; email: string; password: string }
