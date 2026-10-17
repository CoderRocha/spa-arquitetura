import { t } from '@lingui/core/macro'
import { Trans } from '@lingui/react/macro'
import { createFileRoute, stripSearchParams } from '@tanstack/react-router'
import * as v from 'valibot'
import { Card } from '@ui/card'
import { PageHeader, PageTitle } from '@ui/header'
import { Tabs, TabsList, TabsPanel, TabsTab } from '@ui/tabs'
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
        <TabsList>
          <TabsTab value="profile">
            <Trans>Perfil</Trans>
          </TabsTab>
          <TabsTab value="preferences">
            <Trans>Preferências</Trans>
          </TabsTab>
        </TabsList>
        <TabsPanel value="profile">
          <Card className="flex max-w-xl flex-col gap-6">
            <AvatarUpload />
            <ProfileForm />
          </Card>
        </TabsPanel>
        <TabsPanel value="preferences">
          <Card className="max-w-xl">
            <PreferencesForm />
          </Card>
        </TabsPanel>
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
