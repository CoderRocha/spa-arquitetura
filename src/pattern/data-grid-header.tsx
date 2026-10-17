import { useState, type ReactNode } from 'react'
import { useDebouncedCallback } from '@core/hooks'
import { SearchIcon } from '@ui/icons'
import { Input } from '@ui/input'
import { useTableContext } from '@pattern/data-grid.contexts'

type DataGridHeaderProps = {
  searchLabel: string
  searchPlaceholder?: string
  children?: ReactNode
}

export const DataGridHeader = ({ searchLabel, searchPlaceholder, children }: DataGridHeaderProps) => {
  const table = useTableContext()
  const [query, setQuery] = useState(() => String(table.state.globalFilter ?? ''))
  const applySearch = useDebouncedCallback((value: string) => {
    table.setGlobalFilter(value)
  })

  return (
    <div data-slot="data-grid-header" className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-3">
      <div className="relative w-full max-w-xs">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
        <Input
          type="search"
          size="sm"
          aria-label={searchLabel}
          placeholder={searchPlaceholder}
          value={query}
          className="pl-9"
          onValueChange={(value) => {
            setQuery(value)
            applySearch(value)
          }}
        />
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  )
}
