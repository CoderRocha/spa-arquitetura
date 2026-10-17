import { Trans, useLingui } from '@lingui/react/macro'
import { Link } from '@tanstack/react-router'
import { useAuth } from '@core/auth-context'
import { createFormSubmitHandler, schemaValidation, useAppForm } from '@pattern/form.hooks'
import { signUpSchema, type SignUpValues } from '@features/auth/schemas'

const defaultValues: SignUpValues = { name: '', email: '', password: '', acceptTerms: false }

export const SignUpForm = () => {
  const { t } = useLingui()
  const { signUp } = useAuth()
  const form = useAppForm({
    defaultValues,
    ...schemaValidation(signUpSchema),
    onSubmit: createFormSubmitHandler(signUpSchema, ({ name, email, password }) => signUp({ name, email, password })),
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">{t`Criar conta`}</h1>
        <p className="text-sm text-muted-foreground">{t`Leva menos de um minuto.`}</p>
      </div>
      <form
        noValidate
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault()
          void form.handleSubmit()
        }}
      >
        <form.AppForm>
          <form.FormErrorAlert />
          <form.AppField name="name">
            {(field) => <field.TextField label={t`Nome`} autoComplete="name" />}
          </form.AppField>
          <form.AppField name="email">
            {(field) => <field.TextField label={t`E-mail`} type="email" autoComplete="email" />}
          </form.AppField>
          <form.AppField name="password">
            {(field) => (
              <field.TextField
                label={t`Senha`}
                type="password"
                autoComplete="new-password"
                description={t`Mínimo de 8 caracteres.`}
              />
            )}
          </form.AppField>
          <form.AppField name="acceptTerms">
            {(field) => <field.CheckboxField label={t`Aceito os termos de uso`} />}
          </form.AppField>
          <form.SubmitButton className="mt-2">{t`Criar conta`}</form.SubmitButton>
        </form.AppForm>
      </form>
      <p className="text-center text-sm text-muted-foreground">
        <Trans>
          Já tem conta?{' '}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Entrar
          </Link>
        </Trans>
      </p>
    </div>
  )
}
