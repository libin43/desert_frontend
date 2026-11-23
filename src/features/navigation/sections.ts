/**
 * Single source of truth for page sections. Each section has a clean URL path
 * (no `#`), but all of them live on the one home page: the path only decides
 * where the page scrolls to.
 */
export const SECTIONS = [
  { id: 'top', path: '/', label: 'Home' },
  { id: 'sites', path: '/sites', label: 'Sites' },
  { id: 'tonight', path: '/tonight', label: 'Tonight' },
  { id: 'moon', path: '/moon', label: 'Moon' },
  { id: 'meteors', path: '/meteors', label: 'Meteors' },
  { id: 'camps', path: '/camps', label: 'Camps' },
] as const

export type SectionId = (typeof SECTIONS)[number]['id']

/** Sections shown in the navigation (everything except the hero). */
export const NAV_SECTIONS = SECTIONS.filter((s) => s.id !== 'top')

export const pathForSection = (id: SectionId) => SECTIONS.find((s) => s.id === id)!.path

/** Unknown paths fall back to the top of the page. */
export function sectionForPath(pathname: string): SectionId {
  const clean = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
  return SECTIONS.find((s) => s.path === clean)?.id ?? 'top'
}
