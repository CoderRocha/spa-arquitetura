import { screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, test } from 'vitest'
import { renderApp, signInAsDemo } from '@routes/__specs__/render-app'

describe('items flow', () => {
  beforeEach(signInAsDemo)

  test('lists the most recent items and keeps search in the URL', async () => {
    const { router, user } = renderApp('/items')

    await screen.findByRole('link', { name: 'Item 64' })

    await user.type(screen.getByRole('searchbox', { name: 'Buscar itens' }), 'Item 07')

    await screen.findByText('1 registro')
    expect(router.state.location.search).toEqual({ q: 'Item 07' })
    screen.getByRole('link', { name: 'Item 07' })
    expect(screen.queryByRole('link', { name: 'Item 64' })).toBeNull()
  })

  test('creates an item through the dialog', async () => {
    const { user } = renderApp('/items')

    await user.click(await screen.findByRole('button', { name: 'Novo item' }))
    const dialog = await screen.findByRole('dialog', { name: 'Novo item' })
    await user.type(within(dialog).getByLabelText('Nome'), 'Caixa azul')
    await user.click(within(dialog).getByRole('button', { name: 'Criar item' }))

    await screen.findByText('Item criado')
    await screen.findByRole('link', { name: 'Caixa azul' })
  })

  test('shows the server field error for a duplicated name', async () => {
    const { user } = renderApp('/items')

    await user.click(await screen.findByRole('button', { name: 'Novo item' }))
    const dialog = await screen.findByRole('dialog', { name: 'Novo item' })
    await user.type(within(dialog).getByLabelText('Nome'), 'Item 01')
    await user.click(within(dialog).getByRole('button', { name: 'Criar item' }))

    expect(await within(dialog).findAllByText('Já existe um item com esse nome.')).not.toHaveLength(0)
  })

  test('renders the not found page for unknown items', async () => {
    renderApp('/items/does-not-exist')

    await screen.findByRole('heading', { name: 'Página não encontrada' })
  })
})
