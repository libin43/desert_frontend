import { createContext } from 'react'
import type { Site, SiteId } from '@/features/sites/types'

export interface SiteContextValue {
  site: Site
  setSiteId: (id: SiteId) => void
}

export const SiteContext = createContext<SiteContextValue | null>(null)
