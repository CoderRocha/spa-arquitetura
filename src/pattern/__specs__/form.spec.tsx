import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as v from 'valibot'
import { describe, expect, test, vi } from 'vitest'
import { createFriendlyError } from '@core/http-resource'
import { createFormSubmitHandler, schemaValidation, useAppForm } from '@pattern/form.hooks'

const schema = v.object({
  name: v.pipe(v.string(), v.trim(), v.nonEmpty('Obrigatório')),
})

type Values = v.InferOutput<typeof schema>

const TestForm = ({ onValid }: { onValid: (values: Values) => Promise<unknown> }) => {
  const form = useAppForm({
    defaultValues: { name: '' },
    ...schemaValidation(schema),
    onSubmit: createFormSubmitHandler(schema, onValid),
  })
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        void form.handleSubmit()
      }}
    >
      <form.AppForm>
        <form.FormErrorAlert />
        <form.AppField name="name">{(field) => <field.TextField label="Nome" />}</form.AppField>
        <form.SubmitButton>Enviar</form.SubmitButton>
      </form.AppForm>
    </form>
  )
}

const renderForm = (onValid: (values: Values) => Promise<unknown>) => {
  render(
    <I18nProvider i18n={i18n}>
      <TestForm onValid={onValid} />
    </I18nProvider>,
  )
  return userEvent.setup()
}

describe('form infrastructure', () => {
  test('blocks submission while the schema is invalid', async () => {
    const onValid = vi.fn<(values: Values) => Promise<unknown>>(() => Promise.resolve())
    const user = renderForm(onValid)

    await user.click(screen.getByRole('button', { name: 'Enviar' }))

    await screen.findByText('Obrigatório')
    expect(onValid).not.toHaveBeenCalled()
  })

  test('submits the parsed schema output', async () => {
    const onValid = vi.fn<(values: Values) => Promise<unknown>>(() => Promise.resolve())
    const user = renderForm(onValid)

    await user.type(screen.getByLabelText('Nome'), '  Ana  ')
    await user.click(screen.getByRole('button', { name: 'Enviar' }))

    expect(onValid).toHaveBeenCalledWith({ name: 'Ana' })
  })

  test('maps FriendlyError details back into the form', async () => {
    const user = renderForm(() =>
      Promise.reject(
        createFriendlyError({ status: 409, title: 'Conflito', detail: 'Nome em uso', fieldErrors: { name: ['Já existe'] } }),
      ),
    )

    await user.type(screen.getByLabelText('Nome'), 'Ana')
    await user.click(screen.getByRole('button', { name: 'Enviar' }))

    await screen.findByText('Já existe')
    screen.getByText('Nome em uso')
  })
})
