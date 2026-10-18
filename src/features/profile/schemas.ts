import { t } from '@lingui/core/macro'
import * as v from 'valibot'
import { AVATAR_MAX_BYTES, AVATAR_MIME_TYPES, PROFILE_BIO_MAX, PROFILE_NAME_MAX } from '@contracts/profile'
import { optionalText, requiredText } from '@core/schemas'

export const profileFormSchema = v.object({
  name: requiredText(PROFILE_NAME_MAX),
  bio: optionalText(PROFILE_BIO_MAX),
})

export type ProfileFormValues = v.InferInput<typeof profileFormSchema>

export const avatarFileSchema = v.pipe(
  v.file(),
  v.mimeType([...AVATAR_MIME_TYPES], () => t`Use uma imagem PNG, JPG ou WebP.`),
  v.maxSize(AVATAR_MAX_BYTES, () => t`A imagem precisa ter no máximo 2 MB.`),
)
