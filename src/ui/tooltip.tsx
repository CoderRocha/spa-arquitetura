import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip'
import type { ReactElement, ReactNode } from 'react'
import { cx, popupSurface } from '@ui/variants'

export const TooltipProvider = BaseTooltip.Provider

export type TooltipProps = {
  content: ReactNode
  children: ReactElement<Record<string, unknown>>
  side?: 'top' | 'bottom' | 'left' | 'right'
}

export const Tooltip = ({ content, children, side = 'top' }: TooltipProps) => (
  <BaseTooltip.Root>
    <BaseTooltip.Trigger render={children} />
    <BaseTooltip.Portal>
      <BaseTooltip.Positioner side={side} sideOffset={6} className="z-50">
        <BaseTooltip.Popup data-slot="tooltip" className={cx(popupSurface, 'px-2 py-1 text-xs')}>
          {content}
        </BaseTooltip.Popup>
      </BaseTooltip.Positioner>
    </BaseTooltip.Portal>
  </BaseTooltip.Root>
)
