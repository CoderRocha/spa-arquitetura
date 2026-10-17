import { t } from '@lingui/core/macro'
import * as v from 'valibot'
import { optionalText, requiredText } from '@core/schemas'

export const profileFormSchema = v.object({
  name: requiredText(80),
  bio: optionalText(280),
})

export type ProfileFormValues = v.InferInput<typeof profileFormSchema>

export const avatarFileSchema = v.pipe(
  v.file(),
  v.mimeType(['image/png', 'image/jpeg', 'image/webp'], () => t`Use uma imagem PNG, JPG ou WebP.`),
  v.maxSize(2 * 1024 * 1024, () => t`A imagem precisa ter no máximo 2 MB.`),
)
