import { describe, expect, it } from 'vitest'
import { validateBooking } from './validate'

describe('validateBooking', () => {
  it('accepts a complete booking', () => {
    expect(
      validateBooking({ name: 'Sara Ali', email: 'sara@example.com', phone: '+971 50 123 4567' }),
    ).toEqual({})
  })

  it('treats phone as optional', () => {
    expect(validateBooking({ name: 'Sara', email: 'sara@example.com', phone: '' })).toEqual({})
  })

  it('flags each invalid field', () => {
    const errors = validateBooking({ name: ' ', email: 'nope', phone: 'abc' })
    expect(Object.keys(errors).sort()).toEqual(['email', 'name', 'phone'])
  })
})
