import { describe, expect, test, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { Button } from '@ui/button'

describe('Button', () => {
  test('exposes slot, variant and size as data attributes', async () => {
    const screen = await render(
      <Button variant="destructive" size="sm">
        Remover
      </Button>,
    )
    const button = screen.getByRole('button', { name: 'Remover' })

    await expect.element(button).toHaveAttribute('data-slot', 'button')
    await expect.element(button).toHaveAttribute('data-variant', 'destructive')
    await expect.element(button).toHaveAttribute('data-size', 'sm')
    await expect.element(button).toHaveAttribute('type', 'button')
  })

  test('merges custom classes over variant classes', async () => {
    const screen = await render(<Button className="h-20">Alto</Button>)

    await expect.element(screen.getByRole('button', { name: 'Alto' })).toHaveClass('h-20')
    await expect.element(screen.getByRole('button', { name: 'Alto' })).not.toHaveClass('h-8')
  })

  test('calls onClick', async () => {
    const onClick = vi.fn<() => void>()
    const screen = await render(<Button onClick={onClick}>Ok</Button>)

    await screen.getByRole('button', { name: 'Ok' }).click()

    expect(onClick).toHaveBeenCalledOnce()
  })
})
