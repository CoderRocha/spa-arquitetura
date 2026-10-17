import { Toast } from '@base-ui/react/toast'
import { buttonVariants } from '@ui/button.variants'
import { CloseIcon } from '@ui/icons'
import { cx, popupSurface } from '@ui/variants'

export const toastManager = Toast.createToastManager()

type ToasterProps = {
  closeLabel: string
}

const ToastList = ({ closeLabel }: ToasterProps) => {
  const { toasts } = Toast.useToastManager()
  return toasts.map((toast) => (
    <Toast.Root
      key={toast.id}
      toast={toast}
      data-slot="toast"
      className={cx(
        popupSurface,
        'relative flex flex-col gap-0.5 border-l-4 py-3 pr-10 pl-4 data-[type=error]:border-l-danger data-[type=success]:border-l-success',
      )}
    >
      <Toast.Title className="text-sm font-medium" />
      <Toast.Description className="text-sm text-muted" />
      <Toast.Close
        aria-label={closeLabel}
        className={buttonVariants({ variant: 'ghost', size: 'icon', className: 'absolute top-1.5 right-1.5 size-7' })}
      >
        <CloseIcon />
      </Toast.Close>
    </Toast.Root>
  ))
}

export const Toaster = ({ closeLabel }: ToasterProps) => (
  <Toast.Provider toastManager={toastManager} limit={3}>
    <Toast.Portal>
      <Toast.Viewport className="fixed right-4 bottom-4 z-50 flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-2">
        <ToastList closeLabel={closeLabel} />
      </Toast.Viewport>
    </Toast.Portal>
  </Toast.Provider>
)
