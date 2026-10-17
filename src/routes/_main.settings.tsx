import { t } from '@lingui/core/macro'
import { Trans } from '@lingui/react/macro'
import { createFileRoute, stripSearchParams } from '@tanstack/react-router'
import * as v from 'valibot'
import { Card, CardContent } from '@ui/card'
import { PageHeader, PageTitle } from '@ui/header'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@ui/tabs'
import { AvatarUpload } from '@features/profile/avatar-upload'
import { ProfileForm } from '@features/profile/profile-form'
import { PreferencesForm } from '@features/settings/preferences-form'

const settingsTabSchema = v.picklist(['profile', 'preferences'])

const SettingsRoute = () => {
  const { tab } = Route.useSearch()
  const navigate = Route.useNavigate()

  return (
    <>
      <PageHeader>
        <PageTitle>
          <Trans>Configurações</Trans>
        </PageTitle>
      </PageHeader>
      <Tabs
        value={tab}
        onValueChange={(value) => {
          if (v.is(settingsTabSchema, value)) void navigate({ search: { tab: value }, replace: true })
        }}
      >
        <TabsList className="w-full sm:w-fit">
          <TabsTrigger value="profile">
            <Trans>Perfil</Trans>
          </TabsTrigger>
          <TabsTrigger value="preferences">
            <Trans>Preferências</Trans>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Card className="max-w-xl">
            <CardContent className="flex flex-col gap-6">
              <AvatarUpload />
              <ProfileForm />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="preferences">
          <Card className="max-w-xl">
            <CardContent>
              <PreferencesForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  )
}

export const Route = createFileRoute('/_main/settings')({
  validateSearch: v.object({
    tab: v.fallback(v.optional(settingsTabSchema, 'profile'), 'profile'),
  }),
  search: { middlewares: [stripSearchParams({ tab: 'profile' })] },
  head: () => ({ meta: [{ title: t`Configurações` }] }),
  component: SettingsRoute,
})
