import { describe, expect, it } from 'vitest'
import { labelFor, scoreVisibility } from './visibility'

const base = { cloudCover: [0, 0, 0], bortle: 1, moonIllumination: 0, moonUpFraction: 0 }

describe('scoreVisibility', () => {
  it('gives 100 for a clear, moonless night at the darkest site', () => {
    expect(scoreVisibility(base).score).toBe(100)
  })

  it('drops sharply with cloud', () => {
    const clear = scoreVisibility(base).score
    const cloudy = scoreVisibility({ ...base, cloudCover: [80, 90, 85] }).score
    expect(cloudy).toBeLessThan(clear * 0.2)
  })

  it('ignores a bright moon that is below the horizon', () => {
    const down = scoreVisibility({ ...base, moonIllumination: 1, moonUpFraction: 0 })
    expect(down.score).toBe(100)
  })

  it('penalises a full moon that is up all night', () => {
    const up = scoreVisibility({ ...base, moonIllumination: 1, moonUpFraction: 1 })
    expect(up.score).toBeLessThan(35)
  })

  it('ranks darker sites higher under identical conditions', () => {
    const dark = scoreVisibility({ ...base, bortle: 2 }).score
    const bright = scoreVisibility({ ...base, bortle: 5 }).score
    expect(dark).toBeGreaterThan(bright)
  })

  it('handles an empty cloud series', () => {
    expect(scoreVisibility({ ...base, cloudCover: [] }).score).toBe(100)
  })
})

describe('labelFor', () => {
  it.each([
    [95, 'Exceptional'],
    [80, 'Exceptional'],
    [65, 'Good'],
    [45, 'Fair'],
    [10, 'Poor'],
  ])('labels %i as %s', (score, label) => {
    expect(labelFor(score)).toBe(label)
  })
})
