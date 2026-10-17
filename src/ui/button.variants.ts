import { cva } from '@ui/variants'

export const buttonVariants = cva({
  base: 'inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-control font-medium transition-colors select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0',
  variants: {
    variant: {
      primary: 'bg-primary text-primary-foreground hover:bg-primary-hover',
      secondary: 'border border-border bg-surface text-foreground hover:bg-surface-muted',
      ghost: 'text-foreground hover:bg-surface-muted',
      danger: 'bg-danger text-primary-foreground hover:bg-danger-hover',
      link: 'h-auto px-0 text-primary underline-offset-4 hover:underline',
    },
    size: {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-sm',
      lg: 'h-11 px-5 text-base',
      icon: 'size-9',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
})
