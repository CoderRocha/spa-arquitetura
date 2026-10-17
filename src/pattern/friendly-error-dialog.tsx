import { useLingui } from '@lingui/react/macro'
import type { FriendlyError } from '@core/http-resource'
import { Button } from '@ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle } from '@ui/dialog'

type FriendlyErrorDialogProps = {
  error: FriendlyError | null
  onClose: () => void
}

export const FriendlyErrorDialog = ({ error, onClose }: FriendlyErrorDialogProps) => {
  const { t } = useLingui()
  return (
    <Dialog
      open={error !== null}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DialogContent role="alertdialog" closeLabel={t`Fechar`}>
        <DialogTitle>{error?.title}</DialogTitle>
        {error?.detail && <DialogDescription>{error.detail}</DialogDescription>}
        <DialogFooter>
          <DialogClose render={<Button variant="secondary" />}>{t`Entendi`}</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
