import { useLingui } from '@lingui/react/macro'
import { toast } from 'sonner'
import type { Item } from '@contracts/items'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@ui/dialog'
import { createFormSubmitHandler, schemaValidation, useAppForm } from '@pattern/form.hooks'
import { useCreateItem, useUpdateItem } from '@features/items/hooks'
import { itemFormSchema, type ItemFormValues } from '@features/items/schemas'
import { useItemStatusLabels } from '@features/items/status-badge'

const emptyValues: ItemFormValues = { name: '', description: '', status: 'draft', quantity: 0 }

type ItemFormProps = {
  item: Item | undefined
  onDone: () => void
}

const ItemForm = ({ item, onDone }: ItemFormProps) => {
  const { t } = useLingui()
  const statusLabels = useItemStatusLabels()
  const createItem = useCreateItem()
  const updateItem = useUpdateItem(item?.id ?? '')
  const form = useAppForm({
    defaultValues: item
      ? { name: item.name, description: item.description, status: item.status, quantity: item.quantity }
      : emptyValues,
    ...schemaValidation(itemFormSchema),
    onSubmit: createFormSubmitHandler(itemFormSchema, async (input) => {
      await (item ? updateItem.mutateAsync(input) : createItem.mutateAsync(input))
      toast.success(item ? t`Item atualizado` : t`Item criado`)
      onDone()
    }),
  })
  const statusOptions = Object.entries(statusLabels).map(([value, label]) => ({ value, label }))

  return (
    <form
      noValidate
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault()
        void form.handleSubmit()
      }}
    >
      <form.AppForm>
        <form.FormErrorAlert />
        <form.AppField name="name">{(field) => <field.TextField label={t`Nome`} />}</form.AppField>
        <form.AppField name="description">
          {(field) => <field.TextareaField label={t`Descrição`} rows={3} />}
        </form.AppField>
        <div className="grid gap-4 sm:grid-cols-2">
          <form.AppField name="status">
            {(field) => <field.SelectField label={t`Status`} options={statusOptions} />}
          </form.AppField>
          <form.AppField name="quantity">
            {(field) => <field.NumberField label={t`Quantidade`} min={0} />}
          </form.AppField>
        </div>
        <DialogFooter>
          <form.SubmitButton>{item ? t`Salvar alterações` : t`Criar item`}</form.SubmitButton>
        </DialogFooter>
      </form.AppForm>
    </form>
  )
}

type ItemDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  item?: Item
}

export const ItemDialog = ({ open, onOpenChange, item }: ItemDialogProps) => {
  const { t } = useLingui()
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent closeLabel={t`Fechar`} className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{item ? t`Editar item` : t`Novo item`}</DialogTitle>
          <DialogDescription>{t`Preencha as informações abaixo.`}</DialogDescription>
        </DialogHeader>
        <ItemForm
          item={item}
          onDone={() => {
            onOpenChange(false)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
