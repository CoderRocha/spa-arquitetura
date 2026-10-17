import { cva } from '@ui/variants'

export const inputVariants = cva({
  base: 'w-full rounded-control border border-border bg-surface px-3 text-sm text-foreground transition-colors outline-none placeholder:text-muted focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/25 disabled:cursor-not-allowed disabled:opacity-50 data-[invalid]:border-danger data-[invalid]:focus-visible:ring-danger/25',
  variants: {
    size: {
      sm: 'h-8',
      md: 'h-10',
      multiline: 'min-h-24 py-2 leading-relaxed',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})
