import { animate, motion, useInView, useMotionValue, useTransform } from 'motion/react'
import { useEffect, useRef } from 'react'
import type { VisibilityResult } from '@/lib/visibility'

const R = 112
const C = 2 * Math.PI * R

export function VisibilityRing({ visibility }: { visibility: VisibilityResult }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-15% 0px' })
  const count = useMotionValue(0)
  const shown = useTransform(count, (v) => Math.round(v))

  useEffect(() => {
    if (!inView) return
    const controls = animate(count, visibility.score, { duration: 1.8, ease: [0.16, 1, 0.3, 1] })
    return () => controls.stop()
  }, [inView, visibility.score, count])

  return (
    <div ref={ref} className="relative mx-auto aspect-square w-full max-w-[22rem]">
      <svg viewBox="0 0 260 260" className="size-full -rotate-90" aria-hidden="true">
        <circle
          cx="130"
          cy="130"
          r={R}
          fill="none"
          stroke="var(--color-night-700)"
          strokeWidth="2"
        />
        <motion.circle
          cx="130"
          cy="130"
          r={R}
          fill="none"
          stroke="var(--color-star-400)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={C}
          initial={{ strokeDashoffset: C }}
          animate={{ strokeDashoffset: inView ? C * (1 - visibility.score / 100) : C }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <p className="sr-only">
          Visibility score {visibility.score} out of 100, {visibility.label}
        </p>
        <motion.span
          aria-hidden="true"
          className="font-display-light tabular text-[5.5rem] leading-none text-mist-100 sm:text-[6.5rem]"
        >
          {shown}
        </motion.span>
        <span aria-hidden="true" className="font-display-light mt-2 text-2xl text-star-400">
          {visibility.label}
        </span>
      </div>
    </div>
  )
}
