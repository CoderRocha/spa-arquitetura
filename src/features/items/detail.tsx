import { useLingui } from '@lingui/react/macro'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { itemDetailQuery } from '@core/queries'
import { Button } from '@ui/button'
import { buttonVariants } from '@ui/button.variants'
import { Card } from '@ui/card'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle } from '@ui/dialog'
import { PageDescription, PageHeader, PageTitle } from '@ui/header'
import { ChevronLeftIcon } from '@ui/icons'
import { toastManager } from '@ui/toaster'
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
      <Link to="/items" className={buttonVariants({ variant: 'link', size: 'sm', className: 'self-start' })}>
        <ChevronLeftIcon />
        {t`Itens`}
      </Link>
      <PageHeader className="pb-0">
        <div>
          <PageTitle className="flex items-center gap-3">
            {item.name}
            <ItemStatusBadge status={item.status} />
          </PageTitle>
          <PageDescription>
            {t`Atualizado em ${updatedAt}`}
          </PageDescription>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              setEditing(true)
            }}
          >
            {t`Editar`}
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              setConfirmingDelete(true)
            }}
          >
            {t`Excluir`}
          </Button>
        </div>
      </PageHeader>
      <Card>
        <dl className="grid gap-6 sm:grid-cols-[10rem_1fr]">
          <dt className="text-sm text-muted">{t`Descrição`}</dt>
          <dd className="whitespace-pre-line">{item.description || '-'}</dd>
          <dt className="text-sm text-muted">{t`Quantidade`}</dt>
          <dd className="tabular-nums">{i18n.number(item.quantity)}</dd>
        </dl>
      </Card>

      <ItemDialog open={editing} onOpenChange={setEditing} item={item} />

      <Dialog open={confirmingDelete} onOpenChange={setConfirmingDelete}>
        <DialogContent role="alertdialog" closeLabel={t`Fechar`}>
          <DialogTitle>{t`Excluir "${name}"?`}</DialogTitle>
          <DialogDescription>{t`Essa ação não pode ser desfeita.`}</DialogDescription>
          <DialogFooter>
            <DialogClose render={<Button variant="secondary" />}>{t`Cancelar`}</DialogClose>
            <Button
              variant="danger"
              disabled={deleteItem.isPending}
              onClick={() => {
                setConfirmingDelete(false)
                deleteItem.mutate(undefined, {
                  onSuccess: () => {
                    toastManager.add({ title: t`Item excluído`, type: 'success' })
                    onDeleted()
                  },
                })
              }}
            >
              {t`Excluir`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <FriendlyErrorDialog error={deleteItem.error} onClose={deleteItem.reset} />
    </div>
  )
}
