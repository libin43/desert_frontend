import { motion } from 'motion/react'
import type { VisibilityResult } from '@/lib/visibility'

const ROWS = [
  { key: 'clarity', label: 'Clear of cloud' },
  { key: 'moon', label: 'Moon out of the way' },
  { key: 'site', label: 'Darkness of the site' },
] as const

/** Shows what pulled the score up or down. */
export function FactorBars({ factors }: { factors: VisibilityResult['factors'] }) {
  return (
    <div>
      <h3 className="text-sm text-mist-300">What makes up the score</h3>
      <ul className="mt-4 space-y-4">
        {ROWS.map(({ key, label }) => {
          const pct = Math.round(factors[key] * 100)
          return (
            <li key={key}>
              <div className="flex justify-between text-sm">
                <span className="text-mist-300">{label}</span>
                <span className="tabular text-mist-100">{pct}%</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-night-700">
                <motion.div
                  className="h-full rounded-full bg-star-400"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${pct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
