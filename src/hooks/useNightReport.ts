import { useMemo } from 'react'
import { buildNightReport } from '@/lib/nightReport'
import { tonightKey, type DateKey } from '@/lib/time'
import type { Site } from '@/features/sites/types'
import { useCloudForecast } from './useCloudForecast'

/** Report for one night at a site. Defaults to tonight. */
export function useNightReport(site: Site, key?: DateKey) {
  const { forecast, loading } = useCloudForecast(site)
  const nightKey = key ?? tonightKey()
  const report = useMemo(
    () => buildNightReport(site, nightKey, forecast),
    [site, nightKey, forecast],
  )
  return { report, loading }
}
