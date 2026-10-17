import { useLingui } from '@lingui/react/macro'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { metricsQuery } from '@core/queries'
import { buttonVariants } from '@ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@ui/card'
import { Skeleton } from '@ui/skeleton'
import { WidgetBoundary } from '@pattern/widget-boundary'

const MetricsCards = () => {
  const { t, i18n } = useLingui()
  const { data } = useSuspenseQuery(metricsQuery())
  const cards = [
    { label: t`Total de itens`, value: i18n.number(data.totalItems) },
    { label: t`Ativos`, value: i18n.number(data.activeItems) },
    { label: t`Rascunhos`, value: i18n.number(data.draftItems) },
    { label: t`Taxa de ativos`, value: i18n.number(data.activeRatio, { style: 'percent' }) },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.label}>
          <CardHeader>
            <CardDescription>{card.label}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold tracking-tight tabular-nums sm:text-3xl">{card.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

const MetricsSkeleton = () => (
  <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
    {Array.from({ length: 4 }, (_, index) => (
      <Skeleton key={index} className="h-24 rounded-xl" />
    ))}
  </div>
)

export const DashboardOverview = () => {
  const { t } = useLingui()
  return (
    <div className="flex flex-col gap-6">
      <WidgetBoundary fallback={<MetricsSkeleton />}>
        <MetricsCards />
      </WidgetBoundary>
      <Card>
        <CardHeader>
          <CardTitle>{t`Próximos passos`}</CardTitle>
          <CardDescription>{t`Cadastre itens e acompanhe tudo por aqui.`}</CardDescription>
        </CardHeader>
        <CardFooter>
          <Link to="/items" className={buttonVariants({ variant: 'outline' })}>
            {t`Ver itens`}
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
