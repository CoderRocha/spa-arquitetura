import { t } from '@lingui/core/macro'
import { createFileRoute, redirect } from '@tanstack/react-router'
import * as v from 'valibot'
import { safeRedirectSchema } from '@core/schemas'
import { isAuthenticated } from '@core/session-store'
import { SignInForm } from '@features/auth/sign-in-form'

export const Route = createFileRoute('/_auth/login')({
  validateSearch: v.object({ redirect: safeRedirectSchema }),
  beforeLoad: ({ search }) => {
    if (isAuthenticated()) throw redirect({ href: search.redirect ?? '/dashboard' })
  },
  head: () => ({ meta: [{ title: t`Entrar` }] }),
  component: SignInForm,
})
