import { motion, useScroll, useTransform } from 'motion/react'
import { clamp } from '@/lib/math'
import { StarField } from './StarField'

/**
 * The fixed sky behind the whole page. The dusk glow burns off over the first
 * screen of scrolling, then the Milky Way band fades in as the page goes deeper.
 */
export function SkyBackdrop() {
  const { scrollY } = useScroll()
  const vh = () => (typeof window === 'undefined' ? 800 : window.innerHeight)

  const duskOpacity = useTransform(scrollY, (y) => 1 - clamp(y / (vh() * 0.95)))
  const milkyOpacity = useTransform(scrollY, (y) => clamp((y - vh() * 0.7) / (vh() * 1.4)) * 0.9)

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-night-950"
    >
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,var(--color-night-800),transparent_70%)]" />

      <motion.div
        style={{ opacity: milkyOpacity }}
        className="absolute top-1/2 left-1/2 h-[38vmax] w-[170vmax] -translate-x-1/2 -translate-y-1/2 -rotate-[28deg] bg-[radial-gradient(closest-side,rgba(190,198,255,0.17),rgba(139,127,224,0.07)_55%,transparent)] blur-2xl"
      />

      <StarField />

      <motion.div
        style={{ opacity: duskOpacity }}
        className="absolute inset-0 bg-[radial-gradient(130%_65%_at_50%_104%,rgba(226,125,159,0.78),rgba(108,95,199,0.5)_38%,transparent_72%)]"
      />
    </div>
  )
}
