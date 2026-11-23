import type { OutlookNight } from '@/hooks/useOutlook'
import { cn } from '@/lib/cn'
import { formatDate, uaeDate } from '@/lib/time'

interface Props {
  outlook: OutlookNight[]
  value: string
  onChange: (key: string) => void
}

/** Pick a night with its sky score alongside, so the date choice is informed. */
export function NightPicker({ outlook, value, onChange }: Props) {
  return (
    <div
      role="radiogroup"
      aria-label="Night"
      className="-mx-5 flex snap-x scrollbar-none gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:px-0"
    >
      {outlook.map(({ key, report }) => {
        const date = uaeDate(key, 12)
        const selected = key === value
        const { score, label } = report.visibility
        return (
          <button
            key={key}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={`${formatDate(date, { weekday: 'long', day: 'numeric', month: 'long' })}, sky ${label}, score ${score}`}
            onClick={() => onChange(key)}
            className={cn(
              'flex w-[4.25rem] shrink-0 snap-start flex-col items-center gap-1 rounded-2xl border px-2 py-3 transition-colors',
              selected
                ? 'border-star-400 bg-star-400 text-night-950'
                : 'border-white/15 text-mist-100 hover:border-white/40',
            )}
          >
            <span className={cn('text-xs', selected ? 'text-night-800' : 'text-mist-400')}>
              {formatDate(date, { weekday: 'short' })}
            </span>
            <span className="font-display-light tabular text-2xl leading-none">
              {formatDate(date, { day: 'numeric' })}
            </span>
            <span
              className={cn(
                'mt-1 h-1 w-8 overflow-hidden rounded-full',
                selected ? 'bg-night-950/20' : 'bg-white/15',
              )}
            >
              <span
                className={cn(
                  'block h-full rounded-full',
                  selected ? 'bg-night-950' : 'bg-star-400',
                )}
                style={{ width: `${score}%` }}
              />
            </span>
            <span className={cn('tabular text-xs', selected ? 'text-night-800' : 'text-mist-400')}>
              {score}
            </span>
          </button>
        )
      })}
    </div>
  )
}
