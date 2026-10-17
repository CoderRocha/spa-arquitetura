import {
  columnFilteringFeature,
  columnSizingFeature,
  createTableHookContexts,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  tableFeatures,
} from '@tanstack/react-table'

export const dataGridFeatures = tableFeatures({
  columnSizingFeature,
  columnFilteringFeature,
  globalFilteringFeature,
  rowSortingFeature,
  rowPaginationFeature,
})

export const { tableContext, cellContext, headerContext, useTableContext } =
  createTableHookContexts<typeof dataGridFeatures>()
