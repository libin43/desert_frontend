import { DARK_MOON_THRESHOLD, type MoonDay } from '@/lib/astronomy'

export interface DarkRun {
  from: MoonDay
  to: MoonDay
  nights: number
}

/** Longest run of consecutive nights where the moon is a thin crescent or new. */
export function longestDarkRun(days: MoonDay[]): DarkRun | null {
  let best: DarkRun | null = null
  let start = -1
  days.forEach((d, i) => {
    const dark = d.fraction < DARK_MOON_THRESHOLD
    if (dark && start === -1) start = i
    if ((!dark || i === days.length - 1) && start !== -1) {
      const end = dark ? i : i - 1
      const run = { from: days[start]!, to: days[end]!, nights: end - start + 1 }
      if (!best || run.nights > best.nights) best = run
      start = -1
    }
  })
  return best
}
