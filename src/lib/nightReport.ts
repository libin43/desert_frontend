import type { Site } from '@/features/sites/types'
import { computeNight, type NightSummary } from './astronomy'
import { cloudAt, type CloudForecast } from './forecast'
import type { DateKey } from './time'
import { scoreVisibility, type VisibilityResult } from './visibility'

export interface NightReport {
  night: NightSummary
  /** Cloud cover % for each entry in `night.samples`. */
  cloud: number[]
  meanDarkCloud: number
  visibility: VisibilityResult
  forecastSource: CloudForecast['source']
}

/** Everything the UI needs to describe one night at one site. */
export function buildNightReport(site: Site, key: DateKey, forecast: CloudForecast): NightReport {
  const night = computeNight(site, key)
  const cloud = night.samples.map((s) => cloudAt(forecast, s.time, site.id, site.cloudBaseline))
  const darkCloud = cloud.filter((_, i) => night.samples[i]?.phase === 'night')

  const visibility = scoreVisibility({
    cloudCover: darkCloud,
    bortle: site.bortle,
    moonIllumination: night.moonIllumination,
    moonUpFraction: night.moonUpFraction,
  })

  const meanDarkCloud = darkCloud.length
    ? darkCloud.reduce((a, b) => a + b, 0) / darkCloud.length
    : 0

  return { night, cloud, meanDarkCloud, visibility, forecastSource: forecast.source }
}
