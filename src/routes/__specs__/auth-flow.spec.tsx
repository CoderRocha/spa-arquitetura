import { screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'
import { DEMO_EMAIL, DEMO_PASSWORD } from '@mocks/db'
import { renderApp, signInAsDemo } from '@routes/__specs__/render-app'

describe('auth flow', () => {
  test('sends anonymous visitors to login and back to where they were', async () => {
    const { router, user } = renderApp('/items')

    await screen.findByRole('heading', { name: 'Entrar' })
    expect(router.state.location.search).toEqual({ redirect: '/items' })

    await user.type(screen.getByLabelText('E-mail'), DEMO_EMAIL)
    await user.type(screen.getByLabelText('Senha'), DEMO_PASSWORD)
    await user.click(screen.getByRole('button', { name: 'Entrar' }))

    await screen.findByRole('heading', { name: 'Itens' })
    expect(router.state.location.pathname).toBe('/items')
  })

  test('validates the form before calling the API', async () => {
    const { user } = renderApp('/login')

    await user.click(await screen.findByRole('button', { name: 'Entrar' }))

    await screen.findByText('Informe seu e-mail.')
    screen.getByText('Informe sua senha.')
  })

  test('shows the server message for wrong credentials', async () => {
    const { user } = renderApp('/login')

    await user.type(await screen.findByLabelText('E-mail'), DEMO_EMAIL)
    await user.type(screen.getByLabelText('Senha'), 'wrong-password')
    await user.click(screen.getByRole('button', { name: 'Entrar' }))

    await screen.findByText('E-mail ou senha incorretos.')
  })

  test('signs out from the account menu', async () => {
    await signInAsDemo()
    const { user, router } = renderApp('/dashboard')

    await user.click(await screen.findByRole('button', { name: 'Menu da conta' }))
    await user.click(await screen.findByRole('menuitem', { name: 'Sair' }))

    await screen.findByRole('heading', { name: 'Entrar' })
    expect(router.state.location.pathname).toBe('/login')
  })
})
