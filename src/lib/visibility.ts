import { clamp } from './math'

export type VisibilityLabel = 'Exceptional' | 'Good' | 'Fair' | 'Poor'

export interface VisibilityInput {
  /** Cloud cover samples (0–100) taken during fully-dark hours. */
  cloudCover: number[]
  /** Bortle class of the site, 1 (darkest) – 9 (inner city). */
  bortle: number
  /** Moon illuminated fraction, 0–1. */
  moonIllumination: number
  /** Share of dark time with the moon above the horizon, 0–1. */
  moonUpFraction: number
}

export interface VisibilityResult {
  score: number
  label: VisibilityLabel
  factors: {
    /** Share of sky clear of cloud, 0–1. */
    clarity: number
    /** Share of darkness left after moonlight, 0–1. */
    moon: number
    /** Darkness of the site itself, 0–1. */
    site: number
  }
}

export function labelFor(score: number): VisibilityLabel {
  if (score >= 80) return 'Exceptional'
  if (score >= 60) return 'Good'
  if (score >= 40) return 'Fair'
  return 'Poor'
}

/**
 * A single 0–100 number for "how good is the sky". Cloud is the dominant factor
 * (a cloudy night is a lost night), then moonlight, then the site's baseline
 * darkness. The formula is deliberately simple so it can be explained on screen.
 */
export function scoreVisibility(input: VisibilityInput): VisibilityResult {
  const meanCloud = input.cloudCover.length
    ? input.cloudCover.reduce((sum, c) => sum + c, 0) / input.cloudCover.length
    : 0

  const clarity = clamp(1 - meanCloud / 100)
  const moon = clamp(1 - 0.75 * input.moonIllumination * input.moonUpFraction)
  const site = clamp(1 - (input.bortle - 1) / 8)

  const score = 100 * clarity ** 1.3 * moon * (0.5 + 0.5 * site)
  const rounded = Math.round(clamp(score, 0, 100))

  return { score: rounded, label: labelFor(rounded), factors: { clarity, moon, site } }
}
