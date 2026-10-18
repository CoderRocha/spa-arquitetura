import * as v from 'valibot'

export const PROFILE_NAME_MAX = 80

export const PROFILE_BIO_MAX = 280

export const AVATAR_MIME_TYPES = ['image/png', 'image/jpeg', 'image/webp'] as const

export const AVATAR_MAX_BYTES = 2 * 1024 * 1024

export const profileSchema = v.object({
  id: v.string(),
  name: v.string(),
  email: v.string(),
  bio: v.string(),
  avatarUrl: v.nullable(v.string()),
  onboarded: v.boolean(),
})

export const profileInputSchema = v.object({
  name: v.pipe(v.string(), v.trim(), v.nonEmpty(), v.maxLength(PROFILE_NAME_MAX)),
  bio: v.pipe(v.string(), v.trim(), v.maxLength(PROFILE_BIO_MAX)),
})

export type Profile = v.InferOutput<typeof profileSchema>

export type ProfileInput = v.InferOutput<typeof profileInputSchema>
