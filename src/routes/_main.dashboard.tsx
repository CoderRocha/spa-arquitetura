import { t } from '@lingui/core/macro'
import { Trans } from '@lingui/react/macro'
import { createFileRoute } from '@tanstack/react-router'
import { metricsQuery } from '@core/queries'
import { PageDescription, PageHeader, PageTitle } from '@ui/header'
import { DashboardOverview } from '@features/dashboard/overview'

const DashboardRoute = () => (
  <>
    <PageHeader>
      <div>
        <PageTitle>
          <Trans>Visão geral</Trans>
        </PageTitle>
        <PageDescription>
          <Trans>Um resumo do que está acontecendo.</Trans>
        </PageDescription>
      </div>
    </PageHeader>
    <DashboardOverview />
  </>
)

export const Route = createFileRoute('/_main/dashboard')({
  loader: async ({ context }) => {
    await context.queryClient.query(metricsQuery()).catch(() => undefined)
  },
  head: () => ({ meta: [{ title: t`Visão geral` }] }),
  component: DashboardRoute,
})
