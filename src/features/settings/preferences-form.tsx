import { useLingui } from '@lingui/react/macro'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useAppStore } from '@core/app-store'
import type { Locale } from '@core/constants'
import { changeLocale } from '@core/i18n'
import { createFormSubmitHandler, schemaValidation, useAppForm } from '@pattern/form.hooks'
import { preferencesSchema } from '@features/settings/schemas'

const localeOptions = [
  { value: 'pt-BR', label: 'Português (Brasil)' },
  { value: 'en', label: 'English' },
] as const satisfies ReadonlyArray<{ value: Locale; label: string }>

export const PreferencesForm = () => {
  const { t } = useLingui()
  const queryClient = useQueryClient()
  const locale = useAppStore((state) => state.locale)
  const form = useAppForm({
    defaultValues: { locale },
    ...schemaValidation(preferencesSchema),
    onSubmit: createFormSubmitHandler(preferencesSchema, async (preferences) => {
      await changeLocale(preferences.locale)
      await queryClient.invalidateQueries()
      toast.success(t`Preferências salvas`)
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
        <form.AppField name="locale">
          {(field) => <field.RadioGroupField label={t`Idioma`} options={localeOptions} />}
        </form.AppField>
        <form.SubmitButton className="self-start">{t`Salvar preferências`}</form.SubmitButton>
      </form.AppForm>
    </form>
  )
}
