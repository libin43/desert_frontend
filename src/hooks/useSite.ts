import { use } from 'react'
import { SiteContext } from '@/app/site-context'

export function useSite() {
  const ctx = use(SiteContext)
  if (!ctx) throw new Error('useSite must be used inside <SiteProvider>')
  return ctx
}
