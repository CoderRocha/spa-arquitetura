import { createTableHook } from '@tanstack/react-table'
import { cn } from 'cn'
import type { ReactNode } from 'react'
import { DataGridFooter } from '@pattern/data-grid-footer'
import { DataGridHeader } from '@pattern/data-grid-header'
import { DataGridTable } from '@pattern/data-grid-table'
import { cellContext, dataGridFeatures, headerContext, tableContext } from '@pattern/data-grid.contexts'

export const { useAppTable: useDataGrid, createAppColumnHelper: createDataGridColumnHelper } = createTableHook({
  features: dataGridFeatures,
  tableContext,
  cellContext,
  headerContext,
  manualSorting: true,
  manualPagination: true,
  manualFiltering: true,
  tableComponents: {
    Header: DataGridHeader,
    Body: DataGridTable,
    Footer: DataGridFooter,
  },
})

type DataGridFrameProps = {
  busy?: boolean
  children: ReactNode
}

export const DataGridFrame = ({ busy = false, children }: DataGridFrameProps) => (
  <div
    data-slot="data-grid"
    aria-busy={busy}
    className={cn('overflow-hidden rounded-xl border bg-card transition-opacity', busy && 'opacity-60')}
  >
    {children}
  </div>
)
