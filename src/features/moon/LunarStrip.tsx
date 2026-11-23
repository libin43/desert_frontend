import { MoonDisc } from '@/components/ui/MoonDisc'
import { DARK_MOON_THRESHOLD, moonPhaseName, type MoonDay } from '@/lib/astronomy'
import { cn } from '@/lib/cn'
import { formatDate, uaeDate } from '@/lib/time'

interface Props {
  days: MoonDay[]
  selected: string
  onSelect: (key: string) => void
}

/** The next 30 nights as small moons. Gold ring means dark enough for the Milky Way. */
export function LunarStrip({ days, selected, onSelect }: Props) {
  return (
    <div
      role="radiogroup"
      aria-label="Choose a night to see its moon"
      className="grid grid-cols-6 gap-x-2 gap-y-4 sm:grid-cols-10"
    >
      {days.map((d, i) => {
        const date = uaeDate(d.key, 12)
        const dark = d.fraction < DARK_MOON_THRESHOLD
        const isSelected = d.key === selected
        return (
          <button
            key={d.key}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={`${formatDate(date, { weekday: 'long', day: 'numeric', month: 'long' })}, ${moonPhaseName(d.phase)}, ${Math.round(d.fraction * 100)}% lit${dark ? ', dark sky night' : ''}`}
            onClick={() => onSelect(d.key)}
            className={cn(
              'group flex flex-col items-center gap-1.5 rounded-xl p-1.5 transition-colors',
              isSelected ? 'bg-white/10' : 'hover:bg-white/5',
            )}
          >
            <span
              className={cn(
                'block w-full max-w-9 rounded-full p-[3px] transition-shadow',
                dark && 'ring-1 ring-star-400',
                isSelected && 'ring-2',
              )}
            >
              <MoonDisc phase={d.phase} fraction={d.fraction} />
            </span>
            <span className={cn('tabular text-xs', isSelected ? 'text-mist-100' : 'text-mist-400')}>
              {i === 0 ? 'Today' : formatDate(date, { day: 'numeric' })}
            </span>
          </button>
        )
      })}
    </div>
  )
}
