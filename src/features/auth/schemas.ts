import { t } from '@lingui/core/macro'
import * as v from 'valibot'
import { emailSchema, passwordSchema, requiredText } from '@core/schemas'

export const signInSchema = v.object({
  email: emailSchema,
  password: v.pipe(
    v.string(),
    v.nonEmpty(() => t`Informe sua senha.`),
  ),
})

export type SignInValues = v.InferInput<typeof signInSchema>

export const signUpSchema = v.object({
  name: requiredText(80),
  email: emailSchema,
  password: passwordSchema,
  acceptTerms: v.pipe(
    v.boolean(),
    v.value(true, () => t`Você precisa aceitar os termos de uso.`),
  ),
})

export type SignUpValues = v.InferInput<typeof signUpSchema>
