import { ScrollArea as BaseScrollArea } from '@base-ui/react/scroll-area'
import type { ComponentProps, Ref } from 'react'
import { cx, type WithClassName } from '@ui/variants'

export type ScrollAreaProps = WithClassName<ComponentProps<typeof BaseScrollArea.Root>> & {
  viewportRef?: Ref<HTMLDivElement>
  viewportClassName?: string
}

export const ScrollArea = ({ className, viewportRef, viewportClassName, children, ...props }: ScrollAreaProps) => (
  <BaseScrollArea.Root data-slot="scroll-area" className={cx('relative overflow-hidden', className)} {...props}>
    <BaseScrollArea.Viewport ref={viewportRef} className={cx('size-full overscroll-contain', viewportClassName)}>
      {children}
    </BaseScrollArea.Viewport>
    {(['vertical', 'horizontal'] as const).map((orientation) => (
      <BaseScrollArea.Scrollbar
        key={orientation}
        orientation={orientation}
        className="flex touch-none p-0.5 opacity-0 transition-opacity select-none data-hovering:opacity-100 data-scrolling:opacity-100 data-[orientation=horizontal]:h-2.5 data-[orientation=vertical]:w-2.5"
      >
        <BaseScrollArea.Thumb className="flex-1 rounded-full bg-muted/40" />
      </BaseScrollArea.Scrollbar>
    ))}
    <BaseScrollArea.Corner />
  </BaseScrollArea.Root>
)
