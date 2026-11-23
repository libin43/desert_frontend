import { useEffect, useState } from 'react'
import { loadForecast, type CloudForecast } from '@/lib/forecast'
import type { Site } from '@/features/sites/types'

const EMPTY: CloudForecast = { source: 'estimate', hours: new Map() }

/** Live cloud forecast for a site. Falls back to an estimate while loading or offline. */
export function useCloudForecast(site: Site) {
  const [state, setState] = useState<{ siteId: string; forecast: CloudForecast } | null>(null)

  useEffect(() => {
    let cancelled = false
    loadForecast(site.id, site.lat, site.lng).then((forecast) => {
      if (!cancelled) setState({ siteId: site.id, forecast })
    })
    return () => {
      cancelled = true
    }
  }, [site.id, site.lat, site.lng])

  const ready = state?.siteId === site.id
  return { forecast: ready ? state.forecast : EMPTY, loading: !ready }
}
