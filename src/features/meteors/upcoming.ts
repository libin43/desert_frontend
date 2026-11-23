import { getMoonIllumination } from 'suncalc'
import { addDays, uaeDate, type DateKey } from '@/lib/time'
import type { MeteorShower } from './types'

export interface UpcomingShower {
  shower: MeteorShower
  peakKey: DateKey
  peak: Date
  daysAway: number
  /** Moon illuminated fraction at 02:00 on the peak night. */
  moonFraction: number
}

const pad = (n: number) => String(n).padStart(2, '0')

/** Next occurrence of each shower's peak on or after `from`, soonest first. */
export function upcomingShowers(showers: readonly MeteorShower[], from: DateKey): UpcomingShower[] {
  const startYear = Number(from.slice(0, 4))
  const start = uaeDate(from, 0).getTime()

  return showers
    .map((shower) => {
      let peakKey = `${startYear}-${pad(shower.month)}-${pad(shower.day)}`
      if (uaeDate(peakKey, 0).getTime() < start)
        peakKey = `${startYear + 1}-${pad(shower.month)}-${pad(shower.day)}`
      const peak = uaeDate(addDays(peakKey, 1), 2)
      return {
        shower,
        peakKey,
        peak,
        daysAway: Math.round((uaeDate(peakKey, 0).getTime() - start) / 86_400_000),
        moonFraction: getMoonIllumination(peak).fraction,
      }
    })
    .sort((a, b) => a.daysAway - b.daysAway)
}

export function moonVerdict(fraction: number): { label: string; tone: 'good' | 'ok' | 'poor' } {
  if (fraction < 0.25) return { label: 'Dark sky. The moon stays out of the way.', tone: 'good' }
  if (fraction < 0.6) return { label: 'Some moonlight. Face away from it.', tone: 'ok' }
  return { label: 'Bright moon. Expect to lose the faint ones.', tone: 'poor' }
}
