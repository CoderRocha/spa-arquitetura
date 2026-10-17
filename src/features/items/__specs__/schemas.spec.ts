import * as v from 'valibot'
import { describe, expect, test } from 'vitest'
import { itemFormSchema, itemSearchSchema } from '@features/items/schemas'

describe('itemSearchSchema', () => {
  test('fills defaults for an empty URL', () => {
    expect(v.parse(itemSearchSchema, {})).toEqual({ page: 1, pageSize: 20, sort: 'updatedAt', order: 'desc', q: '' })
  })

  test('falls back on invalid values instead of breaking the route', () => {
    expect(v.parse(itemSearchSchema, { page: -3, pageSize: 7, sort: 'nope', order: 'up', q: '  abc  ' })).toEqual({
      page: 1,
      pageSize: 20,
      sort: 'updatedAt',
      order: 'desc',
      q: 'abc',
    })
  })
})

describe('itemFormSchema', () => {
  const valid = { name: 'Caixa', description: '', status: 'draft', quantity: 3 }

  test('accepts a valid item', () => {
    expect(v.is(itemFormSchema, valid)).toBe(true)
  })

  test.each([-1, 1.5, Number.NaN])('rejects quantity %s', (quantity) => {
    expect(v.is(itemFormSchema, { ...valid, quantity })).toBe(false)
  })

  test('rejects a blank name after trimming', () => {
    expect(v.is(itemFormSchema, { ...valid, name: '   ' })).toBe(false)
  })
})
