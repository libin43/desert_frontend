import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useState } from 'react'
import { cn } from '@/lib/cn'
import { buttonClass } from '../ui/buttonClass'
import { NAV_SECTIONS, type SectionId } from '@/features/navigation/sections'
import { SectionLink } from '@/features/navigation/SectionLink'
import { Container } from '../ui/Container'
import { Logo } from './Logo'

export function Header({ active }: { active: SectionId }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { scrollY } = useScroll()
  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 24))

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter] duration-300',
        scrolled || open ? 'bg-night-950/70 backdrop-blur-xl' : 'bg-transparent',
      )}
    >
      <Container className="flex h-16 items-center justify-between sm:h-20">
        <SectionLink
          to="top"
          aria-label="Desert Observatory, back to top"
          onClick={() => setOpen(false)}
        >
          <Logo />
        </SectionLink>

        <nav aria-label="Primary" className="hidden items-center gap-9 lg:flex">
          {NAV_SECTIONS.map((item) => (
            <SectionLink
              key={item.id}
              to={item.id}
              aria-current={active === item.id ? 'true' : undefined}
              className={cn(
                'text-[0.95rem] transition-colors hover:text-mist-100',
                active === item.id ? 'text-star-400' : 'text-mist-300',
              )}
            >
              {item.label}
            </SectionLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <SectionLink to="camps" className={buttonClass('primary', 'min-h-11')}>
              Book a camp
            </SectionLink>
          </div>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-full border border-mist-400/30 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="relative block h-3 w-5">
              <span
                className={cn(
                  'absolute left-0 h-px w-5 bg-mist-100 transition-all',
                  open ? 'top-1.5 rotate-45' : 'top-0',
                )}
              />
              <span
                className={cn(
                  'absolute left-0 h-px w-5 bg-mist-100 transition-all',
                  open ? 'top-1.5 -rotate-45' : 'top-3',
                )}
              />
            </span>
          </button>
        </div>
      </Container>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            aria-label="Mobile"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden lg:hidden"
          >
            <Container className="flex flex-col pt-2 pb-8">
              {NAV_SECTIONS.map((item) => (
                <SectionLink
                  key={item.id}
                  to={item.id}
                  onClick={() => setOpen(false)}
                  aria-current={active === item.id ? 'true' : undefined}
                  className={cn(
                    'font-display-light border-b border-white/10 py-4 text-3xl',
                    active === item.id ? 'text-star-400' : 'text-mist-100',
                  )}
                >
                  {item.label}
                </SectionLink>
              ))}
              <SectionLink
                to="camps"
                onClick={() => setOpen(false)}
                className={buttonClass('primary', 'mt-6')}
              >
                Book a camp
              </SectionLink>
            </Container>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
