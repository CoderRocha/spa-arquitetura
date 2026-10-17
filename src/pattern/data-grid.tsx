import { createTableHook } from '@tanstack/react-table'
import type { ReactNode } from 'react'
import { cx } from '@ui/variants'
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
    className={cx(
      'overflow-hidden rounded-card border border-border bg-surface transition-opacity',
      busy && 'opacity-60',
    )}
  >
    {children}
  </div>
)
