import { motion, useSpring, useTransform } from 'motion/react'
import { useEffect, useId } from 'react'
import { moonLitPath } from '@/lib/moonPath'
import { cn } from '@/lib/cn'

interface Props {
  /** SunCalc phase, 0 new → 0.5 full → 1 new. */
  phase: number
  /** Illuminated fraction, 0–1. Drives the glow. */
  fraction: number
  /** Morph smoothly when the phase changes. */
  animated?: boolean
  glow?: boolean
  className?: string
  label?: string
}

const MARIA = [
  { cx: 38, cy: 36, rx: 11, ry: 8 },
  { cx: 55, cy: 30, rx: 9, ry: 6 },
  { cx: 60, cy: 50, rx: 8, ry: 10 },
  { cx: 42, cy: 58, rx: 12, ry: 7 },
  { cx: 30, cy: 52, rx: 5, ry: 5 },
]

/** The Moon, lit from the correct side for the given phase. */
export function MoonDisc({
  phase,
  fraction,
  animated = false,
  glow = false,
  className,
  label,
}: Props) {
  const uid = useId()
  const spring = useSpring(phase, { stiffness: 60, damping: 16, mass: 0.8 })
  const d = useTransform(spring, (p) => moonLitPath(p))

  useEffect(() => {
    // Take the shortest way round when the phase wraps past new moon.
    const target = phase + Math.round(spring.get() - phase)
    if (animated) spring.set(target)
    else spring.jump(target)
  }, [phase, animated, spring])

  return (
    <div className={cn('relative aspect-square', className)}>
      {glow && (
        <div
          aria-hidden="true"
          className="absolute -inset-[45%] rounded-full bg-[radial-gradient(closest-side,rgba(246,227,166,0.35),rgba(139,127,224,0.12)_55%,transparent)] transition-opacity duration-700"
          style={{ opacity: 0.15 + fraction * 0.85 }}
        />
      )}
      <svg viewBox="0 0 100 100" role="img" aria-label={label} className="relative size-full">
        <defs>
          <radialGradient id={`${uid}-lit`} cx="38%" cy="36%" r="75%">
            <stop offset="0%" stopColor="#fffaf0" />
            <stop offset="55%" stopColor="#efe6cb" />
            <stop offset="100%" stopColor="#c9c1a4" />
          </radialGradient>
          <radialGradient id={`${uid}-earthshine`} cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="#1b2160" />
            <stop offset="100%" stopColor="#0a0d33" />
          </radialGradient>
          <clipPath id={`${uid}-clip`}>
            <motion.path d={d} />
          </clipPath>
        </defs>
        <circle cx="50" cy="50" r="48" fill={`url(#${uid}-earthshine)`} />
        <g clipPath={`url(#${uid}-clip)`}>
          <circle cx="50" cy="50" r="48" fill={`url(#${uid}-lit)`} />
          {MARIA.map((m, i) => (
            <ellipse key={i} {...m} fill="#8f8aa6" opacity="0.28" />
          ))}
        </g>
        <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(255,255,255,0.08)" />
      </svg>
    </div>
  )
}
