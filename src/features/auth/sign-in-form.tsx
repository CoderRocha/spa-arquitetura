import { Trans, useLingui } from '@lingui/react/macro'
import { Link } from '@tanstack/react-router'
import { useAuth } from '@core/auth-context'
import { createFormSubmitHandler, schemaValidation, useAppForm } from '@pattern/form.hooks'
import { signInSchema, type SignInValues } from '@features/auth/schemas'

const defaultValues: SignInValues = { email: '', password: '' }

export const SignInForm = () => {
  const { t } = useLingui()
  const { signIn } = useAuth()
  const form = useAppForm({
    defaultValues,
    ...schemaValidation(signInSchema),
    onSubmit: createFormSubmitHandler(signInSchema, signIn),
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">{t`Entrar`}</h1>
        <p className="text-sm text-muted">{t`Acesse sua conta para continuar.`}</p>
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
          <form.AppField name="email">
            {(field) => <field.TextField label={t`E-mail`} type="email" autoComplete="email" />}
          </form.AppField>
          <form.AppField name="password">
            {(field) => <field.TextField label={t`Senha`} type="password" autoComplete="current-password" />}
          </form.AppField>
          <form.SubmitButton className="mt-2">{t`Entrar`}</form.SubmitButton>
        </form.AppForm>
      </form>
      <p className="text-center text-sm text-muted">
        <Trans>
          Ainda não tem conta?{' '}
          <Link to="/register" className="font-medium text-primary hover:underline">
            Criar conta
          </Link>
        </Trans>
      </p>
    </div>
  )
}
