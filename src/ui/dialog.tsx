import { Dialog as BaseDialog } from '@base-ui/react/dialog'
import type { ComponentProps } from 'react'
import { buttonVariants } from '@ui/button.variants'
import { CloseIcon } from '@ui/icons'
import { cx, popupSurface, type WithClassName } from '@ui/variants'

export const Dialog = BaseDialog.Root

export const DialogTrigger = BaseDialog.Trigger

export const DialogClose = BaseDialog.Close

export type DialogContentProps = WithClassName<ComponentProps<typeof BaseDialog.Popup>> & {
  closeLabel: string
}

export const DialogContent = ({ className, children, closeLabel, ...props }: DialogContentProps) => (
  <BaseDialog.Portal>
    <BaseDialog.Backdrop className="fixed inset-0 z-40 bg-black/40 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0" />
    <BaseDialog.Popup
      data-slot="dialog"
      className={cx(
        popupSurface,
        'fixed top-1/2 left-1/2 z-50 w-[min(32rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 p-6',
        className,
      )}
      {...props}
    >
      {children}
      <BaseDialog.Close
        aria-label={closeLabel}
        className={buttonVariants({ variant: 'ghost', size: 'icon', className: 'absolute top-3 right-3 text-muted' })}
      >
        <CloseIcon />
      </BaseDialog.Close>
    </BaseDialog.Popup>
  </BaseDialog.Portal>
)

export const DialogTitle = ({ className, ...props }: WithClassName<ComponentProps<typeof BaseDialog.Title>>) => (
  <BaseDialog.Title data-slot="dialog-title" className={cx('pr-8 text-lg font-semibold', className)} {...props} />
)

export const DialogDescription = ({
  className,
  ...props
}: WithClassName<ComponentProps<typeof BaseDialog.Description>>) => (
  <BaseDialog.Description data-slot="dialog-description" className={cx('mt-1 text-sm text-muted', className)} {...props} />
)

export const DialogFooter = ({ className, ...props }: ComponentProps<'div'>) => (
  <div data-slot="dialog-footer" className={cx('mt-6 flex justify-end gap-2', className)} {...props} />
)
