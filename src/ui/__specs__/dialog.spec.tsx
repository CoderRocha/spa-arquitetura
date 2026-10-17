import { describe, expect, test } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { render } from 'vitest-browser-react'
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@ui/dialog'

const renderDialog = () =>
  render(
    <Dialog>
      <DialogTrigger>Abrir</DialogTrigger>
      <DialogContent closeLabel="Fechar">
        <DialogTitle>Título</DialogTitle>
        <DialogDescription>Descrição</DialogDescription>
      </DialogContent>
    </Dialog>,
  )

describe('Dialog', () => {
  test('opens from the trigger with an accessible name', async () => {
    await renderDialog()

    await page.getByRole('button', { name: 'Abrir' }).click()

    await expect.element(page.getByRole('dialog', { name: 'Título' })).toBeVisible()
  })

  test('closes with the labelled close button', async () => {
    await renderDialog()
    await page.getByRole('button', { name: 'Abrir' }).click()

    await page.getByRole('button', { name: 'Fechar' }).click()

    await expect.element(page.getByRole('dialog')).not.toBeInTheDocument()
  })

  test('closes with Escape', async () => {
    await renderDialog()
    await page.getByRole('button', { name: 'Abrir' }).click()
    await expect.element(page.getByRole('dialog')).toBeVisible()

    await userEvent.keyboard('{Escape}')

    await expect.element(page.getByRole('dialog')).not.toBeInTheDocument()
  })
})
