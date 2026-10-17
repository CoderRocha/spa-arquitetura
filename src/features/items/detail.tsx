import { useLingui } from '@lingui/react/macro'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { ChevronLeftIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { itemDetailQuery } from '@core/queries'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@ui/alert-dialog'
import { Button, buttonVariants } from '@ui/button'
import { Card, CardContent } from '@ui/card'
import { PageDescription, PageHeader, PageTitle } from '@ui/header'
import { FriendlyErrorDialog } from '@pattern/friendly-error-dialog'
import { useDeleteItem } from '@features/items/hooks'
import { ItemDialog } from '@features/items/item-dialog'
import { ItemStatusBadge } from '@features/items/status-badge'

type ItemDetailProps = {
  itemId: string
  onDeleted: () => void
}

export const ItemDetail = ({ itemId, onDeleted }: ItemDetailProps) => {
  const { t, i18n } = useLingui()
  const { data: item } = useSuspenseQuery(itemDetailQuery(itemId))
  const deleteItem = useDeleteItem(itemId)
  const [editing, setEditing] = useState(false)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const name = item.name
  const updatedAt = i18n.date(item.updatedAt, { dateStyle: 'long', timeStyle: 'short' })

  return (
    <div className="flex flex-col gap-6">
      <Link to="/items" className={buttonVariants({ variant: 'link', className: 'self-start px-0' })}>
        <ChevronLeftIcon />
        {t`Itens`}
      </Link>
      <PageHeader className="pb-0">
        <div className="min-w-0">
          <PageTitle className="flex flex-wrap items-center gap-3">
            <span className="truncate">{item.name}</span>
            <ItemStatusBadge status={item.status} />
          </PageTitle>
          <PageDescription>{t`Atualizado em ${updatedAt}`}</PageDescription>
        </div>
        <div className="flex w-full gap-2 sm:w-auto">
          <Button
            variant="outline"
            size="lg"
            className="flex-1 sm:flex-none"
            onClick={() => {
              setEditing(true)
            }}
          >
            {t`Editar`}
          </Button>
          <Button
            variant="destructive"
            size="lg"
            className="flex-1 sm:flex-none"
            onClick={() => {
              setConfirmingDelete(true)
            }}
          >
            {t`Excluir`}
          </Button>
        </div>
      </PageHeader>
      <Card>
        <CardContent>
          <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-[10rem_1fr] sm:gap-y-6">
            <dt className="text-muted-foreground">{t`Descrição`}</dt>
            <dd className="whitespace-pre-line">{item.description || '-'}</dd>
            <dt className="mt-4 text-muted-foreground sm:mt-0">{t`Quantidade`}</dt>
            <dd className="tabular-nums">{i18n.number(item.quantity)}</dd>
          </dl>
        </CardContent>
      </Card>

      <ItemDialog open={editing} onOpenChange={setEditing} item={item} />

      <AlertDialog open={confirmingDelete} onOpenChange={setConfirmingDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t`Excluir "${name}"?`}</AlertDialogTitle>
            <AlertDialogDescription>{t`Essa ação não pode ser desfeita.`}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t`Cancelar`}</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deleteItem.isPending}
              onClick={() => {
                setConfirmingDelete(false)
                deleteItem.mutate(undefined, {
                  onSuccess: () => {
                    toast.success(t`Item excluído`)
                    onDeleted()
                  },
                })
              }}
            >
              {t`Excluir`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <FriendlyErrorDialog error={deleteItem.error} onClose={deleteItem.reset} />
    </div>
  )
}
