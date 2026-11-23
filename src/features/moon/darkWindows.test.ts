import { describe, expect, it } from 'vitest'
import type { MoonDay } from '@/lib/astronomy'
import { longestDarkRun } from './darkWindows'

const day = (i: number, fraction: number): MoonDay => ({
  key: `2026-12-${String(i + 1).padStart(2, '0')}`,
  fraction,
  phase: 0,
  waxing: true,
})

describe('longestDarkRun', () => {
  it('finds the longest stretch of dark nights', () => {
    const days = [0.9, 0.1, 0.1, 0.5, 0.05, 0.05, 0.1, 0.8].map((f, i) => day(i, f))
    const run = longestDarkRun(days)
    expect(run?.nights).toBe(3)
    expect(run?.from.key).toBe('2026-12-05')
    expect(run?.to.key).toBe('2026-12-07')
  })

  it('includes a run that reaches the end of the list', () => {
    const days = [0.9, 0.1, 0.1].map((f, i) => day(i, f))
    expect(longestDarkRun(days)?.nights).toBe(2)
  })

  it('returns null when there are no dark nights', () => {
    expect(longestDarkRun([0.9, 0.8].map((f, i) => day(i, f)))).toBeNull()
  })
})
