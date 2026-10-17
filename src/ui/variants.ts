import { defineConfig } from 'cva/config'
import { twMerge } from 'tailwind-merge'

export const { cva, cx } = defineConfig({ cx: twMerge })

export type WithClassName<TProps> = Omit<TProps, 'className'> & { className?: string }

export const popupSurface =
  'rounded-card border border-border bg-surface text-foreground shadow-popup outline-none transition-[opacity,scale] duration-150 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0'

export const menuItem =
  'flex cursor-default items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none select-none data-disabled:opacity-50 data-highlighted:bg-surface-muted'
