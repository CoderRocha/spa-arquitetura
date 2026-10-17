import { SearchIcon } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { useDebouncedCallback } from '@core/hooks'
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
    <div
      data-slot="data-grid-header"
      className="flex flex-col gap-3 border-b p-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="relative w-full sm:max-w-xs">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          aria-label={searchLabel}
          placeholder={searchPlaceholder}
          value={query}
          className="pl-8"
          onChange={(event) => {
            setQuery(event.target.value)
            applySearch(event.target.value)
          }}
        />
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  )
}
