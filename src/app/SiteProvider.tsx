import { useMemo, useState, type ReactNode } from 'react'
import { DEFAULT_SITE_ID, getSite } from '@/features/sites/data/sites'
import type { SiteId } from '@/features/sites/types'
import { SiteContext } from './site-context'

/** The observing site chosen by the visitor. Everything below re-computes from it. */
export function SiteProvider({ children }: { children: ReactNode }) {
  const [siteId, setSiteId] = useState<SiteId>(DEFAULT_SITE_ID)
  const value = useMemo(() => ({ site: getSite(siteId), setSiteId }), [siteId])
  return <SiteContext value={value}>{children}</SiteContext>
}
