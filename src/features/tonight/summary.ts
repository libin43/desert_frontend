import type { NightReport } from '@/lib/nightReport'
import { formatTime } from '@/lib/time'

/** One plain-language sentence on what tonight will be like. */
export function summariseNight(report: NightReport, siteName: string): string {
  const { night, meanDarkCloud, visibility } = report
  const moonGlare = night.moonIllumination * night.moonUpFraction

  if (meanDarkCloud > 55) {
    return `Cloud is the problem tonight: around ${Math.round(meanDarkCloud)}% over ${siteName} while it is dark. The nights below may be better.`
  }
  if (moonGlare > 0.5) {
    return 'A bright moon is up for most of the dark hours. The moon and planets will look superb, but the Milky Way will be washed out. The best nights are below.'
  }
  if (visibility.score >= 80) return 'Clear and nearly moonless. This is a night worth the drive.'
  return 'Mostly clear with limited moonlight. A good night for the Milky Way and faint objects.'
}

/** Short description of where the Moon is during the viewing window. */
export function describeMoon(report: NightReport): string {
  const { night } = report
  const first = night.moonEvents[0]
  if (!first)
    return night.samples[0] && night.samples[0].moonAltitude > 0 ? 'Up all night' : 'Down all night'
  return `${first.type === 'set' ? 'Sets' : 'Rises'} at ${formatTime(first.time)}`
}
