import { motion } from 'motion/react'
import type { OutlookNight } from '@/hooks/useOutlook'
import { cn } from '@/lib/cn'
import { formatDate, uaeDate } from '@/lib/time'

/** Fourteen nights of visibility scores, tallest bar is the best night. */
export function OutlookBars({ outlook, tonight }: { outlook: OutlookNight[]; tonight: string }) {
  const best = outlook.reduce((a, b) =>
    b.report.visibility.score > a.report.visibility.score ? b : a,
  )

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
        <h3 className="font-display-light text-heading">The next two weeks</h3>
        <p className="text-mist-300">
          Best night:{' '}
          {formatDate(uaeDate(best.key, 12), { weekday: 'long', day: 'numeric', month: 'long' })},{' '}
          <span className="tabular text-star-400">{best.report.visibility.score}</span>
        </p>
      </div>

      <ul
        className="mt-8 grid grid-cols-7 gap-2 sm:grid-cols-14 sm:gap-3"
        aria-label="Visibility score for each of the next 14 nights"
      >
        {outlook.map(({ key, report }, index) => {
          const { score, label } = report.visibility
          const date = uaeDate(key, 12)
          const isBest = key === best.key
          return (
            <li
              key={key}
              className="flex flex-col items-center gap-2"
              aria-label={`${formatDate(date, { weekday: 'long', day: 'numeric', month: 'long' })}: ${score}, ${label}`}
            >
              <span className="tabular text-sm text-mist-100">{score}</span>
              <div className="flex h-32 w-full items-end sm:h-40">
                <motion.div
                  className={cn('w-full rounded-t-md', isBest ? 'bg-star-400' : 'bg-dusk-500')}
                  style={{ opacity: isBest ? 1 : 0.35 + (score / 100) * 0.65 }}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${Math.max(4, score)}%` }}
                  viewport={{ once: true, margin: '-10% 0px' }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: index * 0.035 }}
                />
              </div>
              <span className={cn('text-xs', key === tonight ? 'text-star-400' : 'text-mist-400')}>
                {key === tonight ? 'Tonight' : formatDate(date, { weekday: 'short' })}
              </span>
              <span className="tabular -mt-1.5 text-xs text-mist-500">
                {formatDate(date, { day: 'numeric' })}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
