import { t } from '@lingui/core/macro'
import * as v from 'valibot'
import { PASSWORD_MAX, PASSWORD_MIN } from '@contracts/auth'

export const requiredText = (max = 120) =>
  v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty(() => t`Campo obrigatório.`),
    v.maxLength(max, () => t`Use no máximo ${max} caracteres.`),
  )

export const optionalText = (max = 500) =>
  v.pipe(
    v.string(),
    v.trim(),
    v.maxLength(max, () => t`Use no máximo ${max} caracteres.`),
  )

export const emailSchema = v.pipe(
  v.string(),
  v.trim(),
  v.nonEmpty(() => t`Informe seu e-mail.`),
  v.email(() => t`E-mail inválido.`),
)

export const passwordSchema = v.pipe(
  v.string(),
  v.minLength(PASSWORD_MIN, () => t`A senha precisa ter pelo menos 8 caracteres.`),
  v.maxLength(PASSWORD_MAX, () => t`Use no máximo ${PASSWORD_MAX} caracteres.`),
)

export const safeRedirectSchema = v.fallback(v.optional(v.pipe(v.string(), v.regex(/^\/(?![/\\])/))), undefined)
