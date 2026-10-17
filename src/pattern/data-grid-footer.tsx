import { Plural, useLingui } from '@lingui/react/macro'
import { Button } from '@ui/button'
import { ChevronLeftIcon, ChevronRightIcon } from '@ui/icons'
import { useTableContext } from '@pattern/data-grid.contexts'

export const DataGridFooter = () => {
  const table = useTableContext()
  const { t } = useLingui()
  const page = table.state.pagination.pageIndex + 1
  const pageCount = Math.max(table.getPageCount(), 1)
  const total = table.getRowCount()

  return (
    <div
      data-slot="data-grid-footer"
      className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3 text-sm text-muted"
    >
      <span>
        <Plural value={total} one="# registro" other="# registros" />
      </span>
      <div className="flex items-center gap-2">
        <span>{t`Página ${page} de ${pageCount}`}</span>
        <Button
          variant="secondary"
          size="icon"
          aria-label={t`Página anterior`}
          disabled={!table.getCanPreviousPage()}
          onClick={() => {
            table.previousPage()
          }}
        >
          <ChevronLeftIcon />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          aria-label={t`Próxima página`}
          disabled={!table.getCanNextPage()}
          onClick={() => {
            table.nextPage()
          }}
        >
          <ChevronRightIcon />
        </Button>
      </div>
    </div>
  )
}
