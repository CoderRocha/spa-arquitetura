import { Trans, useLingui } from '@lingui/react/macro'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { functionalUpdate } from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { ITEM_SORT_FIELDS, type Item } from '@core/api/items'
import { itemListQuery } from '@core/queries'
import { PlusIcon } from 'lucide-react'
import { Button } from '@ui/button'
import { createDataGridColumnHelper, DataGridFrame, useDataGrid } from '@pattern/data-grid'
import { EmptyState } from '@features/items/empty-state'
import { ItemDialog } from '@features/items/item-dialog'
import type { ItemSearch } from '@features/items/schemas'
import { ItemStatusBadge } from '@features/items/status-badge'

const FormattedDate = ({ value }: { value: string }) => {
  const { i18n } = useLingui()
  return <time dateTime={value}>{i18n.date(value, { dateStyle: 'medium', timeStyle: 'short' })}</time>
}

const columnHelper = createDataGridColumnHelper<Item>()

const columns = columnHelper.columns([
  columnHelper.accessor('name', {
    header: () => <Trans>Nome</Trans>,
    size: 240,
    cell: (info) => (
      <Link
        to="/items/$itemId"
        params={{ itemId: info.row.original.id }}
        className="font-medium text-foreground hover:text-primary"
      >
        {info.getValue()}
      </Link>
    ),
  }),
  columnHelper.accessor('status', {
    header: () => <Trans>Status</Trans>,
    size: 120,
    cell: (info) => <ItemStatusBadge status={info.getValue()} />,
  }),
  columnHelper.accessor('quantity', {
    header: () => <Trans>Quantidade</Trans>,
    size: 110,
    cell: (info) => <span className="tabular-nums">{info.getValue()}</span>,
  }),
  columnHelper.accessor('updatedAt', {
    header: () => <Trans>Atualizado em</Trans>,
    size: 180,
    cell: (info) => <FormattedDate value={info.getValue()} />,
  }),
])

const noItems: Item[] = []

type ItemListProps = {
  search: ItemSearch
  onSearchChange: (next: Partial<ItemSearch>) => void
}

export const ItemList = ({ search, onSearchChange }: ItemListProps) => {
  const { t } = useLingui()
  const [creating, setCreating] = useState(false)
  const { data, isPlaceholderData } = useQuery({ ...itemListQuery(search), throwOnError: true })
  const query = search.q

  const sorting = useMemo(() => [{ id: search.sort, desc: search.order === 'desc' }], [search.sort, search.order])
  const pagination = useMemo(
    () => ({ pageIndex: search.page - 1, pageSize: search.pageSize }),
    [search.page, search.pageSize],
  )

  const table = useDataGrid({
    columns,
    data: data?.items ?? noItems,
    rowCount: data?.total ?? 0,
    getRowId: (item) => item.id,
    enableSortingRemoval: false,
    state: { sorting, pagination, globalFilter: search.q },
    onSortingChange: (updater) => {
      const [next] = functionalUpdate(updater, sorting)
      onSearchChange({
        sort: ITEM_SORT_FIELDS.find((field) => field === next?.id) ?? 'updatedAt',
        order: next?.desc === false ? 'asc' : 'desc',
        page: 1,
      })
    },
    onPaginationChange: (updater) => {
      onSearchChange({ page: functionalUpdate(updater, pagination).pageIndex + 1 })
    },
    onGlobalFilterChange: (updater) => {
      onSearchChange({ q: String(functionalUpdate(updater, search.q)), page: 1 })
    },
  })

  const createButton = (
    <Button
      onClick={() => {
        setCreating(true)
      }}
    >
      <PlusIcon />
      {t`Novo item`}
    </Button>
  )

  return (
    <>
      <DataGridFrame busy={isPlaceholderData}>
        <table.AppTable>
          <table.Header searchLabel={t`Buscar itens`} searchPlaceholder={t`Buscar por nome`}>
            {createButton}
          </table.Header>
          <table.Body
            caption={t`Lista de itens`}
            emptyState={
              query ? (
                <EmptyState
                  title={t`Nenhum resultado`}
                  description={t`Nenhum item corresponde a "${query}".`}
                />
              ) : (
                <EmptyState
                  title={t`Nenhum item ainda`}
                  description={t`Crie o primeiro item para começar.`}
                  action={createButton}
                />
              )
            }
          />
          <table.Footer />
        </table.AppTable>
      </DataGridFrame>
      <ItemDialog open={creating} onOpenChange={setCreating} />
    </>
  )
}
