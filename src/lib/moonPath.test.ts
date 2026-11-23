import { describe, expect, it } from 'vitest'
import { moonLitPath } from './moonPath'

describe('moonLitPath', () => {
  it('lights the right limb when waxing and the left when waning', () => {
    expect(moonLitPath(0.25)).toContain('A 48 48 0 0 1')
    expect(moonLitPath(0.75)).toContain('A 48 48 0 0 0')
  })

  it('draws a full disc at full moon (terminator width equals the radius)', () => {
    expect(moonLitPath(0.5)).toContain('A 48 48 0 0 0 50 2')
  })

  it('collapses the terminator at the quarters', () => {
    expect(moonLitPath(0.25)).toMatch(/A 0\.\d+ 48/)
  })

  it('wraps phases outside 0–1', () => {
    expect(moonLitPath(1.25)).toBe(moonLitPath(0.25))
  })
})
