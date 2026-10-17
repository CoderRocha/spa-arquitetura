import { Trans, useLingui } from '@lingui/react/macro'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { profileQuery } from '@core/queries'
import { ProfileForm } from '@features/profile/profile-form'

const WelcomeRoute = () => {
  const { t } = useLingui()
  const navigate = Route.useNavigate()
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          <Trans>Boas-vindas!</Trans>
        </h1>
        <p className="text-sm text-muted-foreground">
          <Trans>Conte um pouco sobre você para concluir o cadastro.</Trans>
        </p>
      </div>
      <ProfileForm
        submitLabel={t`Concluir`}
        onSaved={() => {
          void navigate({ to: '/dashboard' })
        }}
      />
    </div>
  )
}

export const Route = createFileRoute('/_onboarding/welcome')({
  loader: async ({ context }) => {
    const profile = await context.queryClient.query(profileQuery())
    if (profile.onboarded) throw redirect({ to: '/dashboard' })
  },
  component: WelcomeRoute,
})
