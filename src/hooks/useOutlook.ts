import { useMemo } from 'react'
import { buildNightReport, type NightReport } from '@/lib/nightReport'
import { addDays, tonightKey } from '@/lib/time'
import type { Site } from '@/features/sites/types'
import { useCloudForecast } from './useCloudForecast'

export interface OutlookNight {
  key: string
  report: NightReport
}

/** Night-by-night outlook starting tonight. */
export function useOutlook(site: Site, nights = 14) {
  const { forecast, loading } = useCloudForecast(site)
  const outlook = useMemo<OutlookNight[]>(() => {
    const start = tonightKey()
    return Array.from({ length: nights }, (_, i) => {
      const key = addDays(start, i)
      return { key, report: buildNightReport(site, key, forecast) }
    })
  }, [site, forecast, nights])
  return { outlook, loading }
}
