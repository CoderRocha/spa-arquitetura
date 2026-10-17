import { useLingui } from '@lingui/react/macro'
import { useSuspenseQuery } from '@tanstack/react-query'
import { profileQuery } from '@core/queries'
import { toastManager } from '@ui/toaster'
import { createFormSubmitHandler, schemaValidation, useAppForm } from '@pattern/form.hooks'
import { useUpdateProfile } from '@features/profile/hooks'
import { profileFormSchema } from '@features/profile/schemas'

type ProfileFormProps = {
  submitLabel?: string
  onSaved?: () => void
}

export const ProfileForm = ({ submitLabel, onSaved }: ProfileFormProps) => {
  const { t } = useLingui()
  const { data: profile } = useSuspenseQuery(profileQuery())
  const updateProfile = useUpdateProfile()
  const form = useAppForm({
    defaultValues: { name: profile.name, bio: profile.bio },
    ...schemaValidation(profileFormSchema),
    onSubmit: createFormSubmitHandler(profileFormSchema, async (input) => {
      await updateProfile.mutateAsync(input)
      toastManager.add({ title: t`Perfil atualizado`, type: 'success' })
      onSaved?.()
    }),
  })

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
        <form.AppField name="name">{(field) => <field.TextField label={t`Nome`} autoComplete="name" />}</form.AppField>
        <form.AppField name="bio">
          {(field) => (
            <field.TextareaField label={t`Sobre você`} rows={3} description={t`Aparece no seu perfil. Opcional.`} />
          )}
        </form.AppField>
        <form.SubmitButton className="self-start">{submitLabel ?? t`Salvar`}</form.SubmitButton>
      </form.AppForm>
    </form>
  )
}
