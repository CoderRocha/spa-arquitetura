import { useVirtualizer } from '@tanstack/react-virtual'
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react'
import { useRef, type ReactNode } from 'react'
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@ui/table'
import { useTableContext } from '@pattern/data-grid.contexts'
import { DATA_GRID_ROW_HEIGHT, dataGridRowVariants, type DataGridDensity } from '@pattern/data-grid.variants'

type DataGridTableProps = {
  caption: string
  density?: DataGridDensity
  emptyState?: ReactNode
}

const ariaSort = { asc: 'ascending', desc: 'descending' } as const

export const DataGridTable = ({ caption, density = 'comfortable', emptyState }: DataGridTableProps) => {
  const table = useTableContext()
  const rows = table.getRowModel().rows
  const scrollRef = useRef<HTMLDivElement>(null)
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => DATA_GRID_ROW_HEIGHT[density],
    overscan: 10,
  })
  const gridTemplateColumns = table
    .getAllLeafColumns()
    .map((column) => `minmax(${column.getSize()}px, 1fr)`)
    .join(' ')

  return (
    <div ref={scrollRef} data-slot="data-grid-table" className="max-h-[60vh] overflow-auto overscroll-contain">
      <table data-slot="table" className="grid w-full min-w-max caption-bottom text-sm">
        <caption className="sr-only">{caption}</caption>
        <TableHeader className="sticky top-0 z-10 grid bg-muted/80 backdrop-blur">
          {table.getHeaderGroups().map((group) => (
            <TableRow key={group.id} className="grid hover:bg-transparent" style={{ gridTemplateColumns }}>
              {group.headers.map((header) => {
                const sorted = header.column.getIsSorted()
                return (
                  <TableHead
                    key={header.id}
                    aria-sort={sorted ? ariaSort[sorted] : undefined}
                    className="flex items-center px-3 text-xs tracking-wide text-muted-foreground uppercase"
                  >
                    {header.column.getCanSort() ? (
                      <button
                        type="button"
                        onClick={header.column.getToggleSortingHandler()}
                        className="inline-flex cursor-pointer items-center gap-1 uppercase hover:text-foreground"
                      >
                        <table.FlexRender header={header} />
                        {sorted === 'asc' && <ArrowUpIcon className="size-3.5" />}
                        {sorted === 'desc' && <ArrowDownIcon className="size-3.5" />}
                      </button>
                    ) : (
                      <table.FlexRender header={header} />
                    )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className="relative grid" style={{ height: virtualizer.getTotalSize() }}>
          {virtualizer.getVirtualItems().map((item) => {
            const row = rows[item.index]
            if (!row) return null
            return (
              <TableRow
                key={row.id}
                className={dataGridRowVariants({ density })}
                style={{ gridTemplateColumns, transform: `translateY(${item.start}px)` }}
              >
                {row.getAllCells().map((cell) => (
                  <TableCell key={cell.id} className="truncate px-3">
                    <table.FlexRender cell={cell} />
                  </TableCell>
                ))}
              </TableRow>
            )
          })}
        </TableBody>
      </table>
      {rows.length === 0 && emptyState}
    </div>
  )
}
