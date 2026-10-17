import { t } from '@lingui/core/macro'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { isAuthenticated } from '@core/session-store'
import { SignUpForm } from '@features/auth/sign-up-form'

export const Route = createFileRoute('/_auth/register')({
  beforeLoad: () => {
    if (isAuthenticated()) throw redirect({ to: '/welcome' })
  },
  head: () => ({ meta: [{ title: t`Criar conta` }] }),
  component: SignUpForm,
})
