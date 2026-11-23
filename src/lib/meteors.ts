import { clamp } from './math'

/** Approximate naked-eye limiting magnitude for a Bortle class. */
export const limitingMagnitude = (bortle: number) => 7.6 - 0.5 * (bortle - 1)

/**
 * A rough hourly rate a person might actually count. ZHR assumes a perfect sky
 * (limiting magnitude 6.5) with the radiant overhead. We halve it for an average
 * radiant altitude, scale by sky darkness (population index ~2.2) and let
 * moonlight cost about a magnitude at full phase.
 */
export function expectedHourlyRate(args: { zhr: number; bortle: number; moonFraction: number }) {
  const lm = limitingMagnitude(args.bortle) - 1.2 * clamp(args.moonFraction)
  return Math.max(0, Math.round(args.zhr * 0.5 * 2.2 ** (lm - 6.5)))
}
