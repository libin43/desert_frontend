import type { ComponentProps, MouseEvent } from 'react'
import { navigateToSection } from './navigate'
import { pathForSection, type SectionId } from './sections'

interface Props extends Omit<ComponentProps<'a'>, 'href'> {
  to: SectionId
}

/**
 * A real link (`/tonight`) that scrolls instead of reloading. Because it keeps a
 * real href, middle-click, "open in new tab" and screen readers all behave.
 */
export function SectionLink({ to, onClick, ...props }: Props) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event)
    if (event.defaultPrevented) return
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
      return
    event.preventDefault()
    navigateToSection(to)
  }

  return <a href={pathForSection(to)} onClick={handleClick} {...props} />
}
