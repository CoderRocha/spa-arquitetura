import { t } from '@lingui/core/macro'
import { Trans } from '@lingui/react/macro'
import { createFileRoute, stripSearchParams } from '@tanstack/react-router'
import { itemListQuery } from '@core/queries'
import { PageDescription, PageHeader, PageTitle } from '@ui/header'
import { ItemList } from '@features/items/list'
import { itemSearchDefaults, itemSearchSchema } from '@features/items/schemas'

const ItemsRoute = () => {
  const search = Route.useSearch()
  const navigate = Route.useNavigate()

  return (
    <>
      <PageHeader>
        <div>
          <PageTitle>
            <Trans>Itens</Trans>
          </PageTitle>
          <PageDescription>
            <Trans>Busca, ordenação e paginação ficam na URL.</Trans>
          </PageDescription>
        </div>
      </PageHeader>
      <ItemList
        search={search}
        onSearchChange={(next) => {
          void navigate({ search: (previous) => ({ ...previous, ...next }), replace: true })
        }}
      />
    </>
  )
}

export const Route = createFileRoute('/_main/items/')({
  validateSearch: itemSearchSchema,
  search: { middlewares: [stripSearchParams(itemSearchDefaults)] },
  loaderDeps: ({ search }) => search,
  loader: async ({ context, deps }) => {
    await context.queryClient.query(itemListQuery(deps))
  },
  head: () => ({ meta: [{ title: t`Itens` }] }),
  component: ItemsRoute,
})
