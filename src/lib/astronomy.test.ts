import { describe, expect, it } from 'vitest'
import { computeNight, moonPhaseName, twilightPhase } from './astronomy'
import { addDays, formatTime, tonightKey, toDateKey } from './time'

const alQudra = { lat: 24.85, lng: 55.37 }

describe('twilightPhase', () => {
  it.each([
    [10, 'day'],
    [-3, 'civil'],
    [-9, 'nautical'],
    [-15, 'astronomical'],
    [-30, 'night'],
  ])('sun at %i° is %s', (alt, phase) => {
    expect(twilightPhase(alt)).toBe(phase)
  })
})

describe('moonPhaseName', () => {
  it('names the principal phases', () => {
    expect(moonPhaseName(0)).toBe('New moon')
    expect(moonPhaseName(0.25)).toBe('First quarter')
    expect(moonPhaseName(0.5)).toBe('Full moon')
    expect(moonPhaseName(0.75)).toBe('Last quarter')
  })
})

describe('UAE date helpers', () => {
  it('rolls early-morning hours back to the previous evening', () => {
    // 02:00 UAE on 24 Nov is 22:00 UTC on 23 Nov.
    expect(tonightKey(new Date('2026-11-23T22:00:00Z'))).toBe('2026-11-23')
    // 08:00 UAE on 24 Nov.
    expect(tonightKey(new Date('2026-11-24T04:00:00Z'))).toBe('2026-11-24')
  })

  it('adds days across month ends', () => {
    expect(addDays('2026-11-30', 1)).toBe('2026-12-01')
    expect(toDateKey(new Date('2026-12-31T21:00:00Z'))).toBe('2027-01-01')
  })
})

describe('computeNight', () => {
  const night = computeNight(alQudra, '2026-11-23')

  it('puts sunset in the early evening and dusk after it', () => {
    expect(formatTime(night.sunset) >= '17:00').toBe(true)
    expect(formatTime(night.sunset) <= '18:30').toBe(true)
    expect(night.astronomicalDusk.getTime()).toBeGreaterThan(night.sunset.getTime())
    expect(night.astronomicalDawn.getTime()).toBeGreaterThan(night.astronomicalDusk.getTime())
  })

  it('finds roughly ten hours of full dark in late November', () => {
    expect(night.darkHours).toBeGreaterThan(9)
    expect(night.darkHours).toBeLessThan(11.5)
  })

  it('samples every quarter hour across the 12-hour window', () => {
    expect(night.samples).toHaveLength(49)
  })
})
