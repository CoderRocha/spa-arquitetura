import { cva } from '@ui/variants'

export const DATA_GRID_ROW_HEIGHT = {
  compact: 40,
  comfortable: 52,
} as const

export type DataGridDensity = keyof typeof DATA_GRID_ROW_HEIGHT

export const dataGridRowVariants = cva({
  base: 'absolute left-0 grid w-full items-center',
  variants: {
    density: {
      compact: 'h-10 text-xs',
      comfortable: 'h-13 text-sm',
    },
  },
  defaultVariants: {
    density: 'comfortable',
  },
})
