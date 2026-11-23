import { pathForSection, type SectionId } from './sections'

/** Scroll a section into view. Smooth scrolling is handled by CSS, which also honours reduced motion. */
export function scrollToSection(id: SectionId, behavior: ScrollBehavior = 'auto') {
  document.getElementById(id)?.scrollIntoView({ behavior, block: 'start' })
}

/** Go to a section: scroll there and update the URL path without reloading. */
export function navigateToSection(id: SectionId) {
  const path = pathForSection(id)
  if (window.location.pathname !== path) window.history.pushState({ section: id }, '', path)
  // Wait two frames so any UI that closes on click (the mobile menu) settles first;
  // a smooth scroll started in the same frame as that layout change gets cancelled.
  requestAnimationFrame(() => requestAnimationFrame(() => scrollToSection(id)))
  window.dispatchEvent(new CustomEvent('section-navigate', { detail: id }))
}
