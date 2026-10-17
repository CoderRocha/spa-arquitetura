import * as v from 'valibot'
import { defineApiRoute, httpResource, httpUpload } from '@core/http-resource'

export const profileSchema = v.object({
  id: v.string(),
  name: v.string(),
  email: v.string(),
  bio: v.string(),
  avatarUrl: v.nullable(v.string()),
  onboarded: v.boolean(),
})

export type Profile = v.InferOutput<typeof profileSchema>

export type ProfileInput = Pick<Profile, 'name' | 'bio'>

export const profileRoutes = {
  current: defineApiRoute('GET', '/profile'),
  update: defineApiRoute('PUT', '/profile'),
  avatar: defineApiRoute('POST', '/profile/avatar'),
}

export const fetchProfile = (signal?: AbortSignal) => httpResource(profileRoutes.current, { schema: profileSchema, signal })

export const updateProfile = (body: ProfileInput) => httpResource(profileRoutes.update, { schema: profileSchema, body })

export const uploadAvatar = (file: File) => {
  const formData = new FormData()
  formData.set('file', file)
  return httpUpload(profileRoutes.avatar, { schema: profileSchema, formData })
}
