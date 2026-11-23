import { describe, expect, it } from 'vitest'
import { expectedHourlyRate } from './meteors'

describe('expectedHourlyRate', () => {
  const zhr = 150

  it('counts more from darker sites', () => {
    const liwa = expectedHourlyRate({ zhr, bortle: 2, moonFraction: 0 })
    const qudra = expectedHourlyRate({ zhr, bortle: 4, moonFraction: 0 })
    expect(liwa).toBeGreaterThan(qudra)
  })

  it('counts fewer under a bright moon', () => {
    const dark = expectedHourlyRate({ zhr, bortle: 3, moonFraction: 0 })
    const full = expectedHourlyRate({ zhr, bortle: 3, moonFraction: 1 })
    expect(full).toBeLessThan(dark)
  })

  it('never goes negative', () => {
    expect(expectedHourlyRate({ zhr: 10, bortle: 9, moonFraction: 1 })).toBeGreaterThanOrEqual(0)
  })
})
