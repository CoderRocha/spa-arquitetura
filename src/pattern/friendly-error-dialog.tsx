import { useLingui } from '@lingui/react/macro'
import type { FriendlyError } from '@core/http-resource'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@ui/alert-dialog'

type FriendlyErrorDialogProps = {
  error: FriendlyError | null
  onClose: () => void
}

export const FriendlyErrorDialog = ({ error, onClose }: FriendlyErrorDialogProps) => {
  const { t } = useLingui()
  return (
    <AlertDialog
      open={error !== null}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{error?.title}</AlertDialogTitle>
          {error?.detail && <AlertDialogDescription>{error.detail}</AlertDialogDescription>}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t`Entendi`}</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
