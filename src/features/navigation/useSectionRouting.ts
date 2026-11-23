import { useEffect, useState } from 'react'
import { scrollToSection } from './navigate'
import { pathForSection, SECTIONS, sectionForPath, type SectionId } from './sections'

const SETTLE_MS = 150

/**
 * Keeps the URL path and scroll position in sync, in both directions:
 *  - opening `/moon` (or pressing back/forward) scrolls to that section;
 *  - scrolling the page updates the path to the section on screen.
 * Returns the active section so the header can highlight it.
 */
export function useSectionRouting(): SectionId {
  const [active, setActive] = useState<SectionId>(() => sectionForPath(window.location.pathname))

  // Land on the section named in the URL, once layout and fonts have settled.
  useEffect(() => {
    const initial = sectionForPath(window.location.pathname)
    if (initial === 'top') return
    const jump = () => scrollToSection(initial, 'instant')
    const frame = requestAnimationFrame(jump)
    document.fonts?.ready.then(jump)
    return () => cancelAnimationFrame(frame)
  }, [])

  useEffect(() => {
    // While a click or back/forward is scrolling, don't let the spy rewrite the URL en route.
    let programmatic = false
    let settleTimer: ReturnType<typeof setTimeout>

    const lock = () => {
      programmatic = true
      clearTimeout(settleTimer)
      settleTimer = setTimeout(() => (programmatic = false), SETTLE_MS * 4)
    }
    const onScroll = () => {
      if (!programmatic) return
      clearTimeout(settleTimer)
      settleTimer = setTimeout(() => (programmatic = false), SETTLE_MS)
    }
    const onNavigate = (e: Event) => {
      lock()
      setActive((e as CustomEvent<SectionId>).detail)
    }
    const onPopState = () => {
      const id = sectionForPath(window.location.pathname)
      lock()
      setActive(id)
      scrollToSection(id)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (programmatic) return
        const visible = entries.filter((e) => e.isIntersecting)
        const top = visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (!top) return
        const id = top.target.id as SectionId
        setActive(id)
        const path = pathForSection(id)
        if (window.location.pathname !== path)
          window.history.replaceState({ section: id }, '', path)
      },
      // A thin band across the middle of the viewport decides which section is "current".
      { rootMargin: '-45% 0px -54% 0px' },
    )
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('popstate', onPopState)
    window.addEventListener('section-navigate', onNavigate)
    return () => {
      clearTimeout(settleTimer)
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('popstate', onPopState)
      window.removeEventListener('section-navigate', onNavigate)
    }
  }, [])

  return active
}
