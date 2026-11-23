import { motion } from 'motion/react'
import { useMemo } from 'react'
import { lunarCalendar } from '@/lib/astronomy'
import { cn } from '@/lib/cn'
import { addDays, formatDate, uaeDate, type DateKey } from '@/lib/time'
import type { UpcomingShower } from './upcoming'

const W = 1200
const DAYS = 366
const BUBBLE_Y = 110
const STRIP_Y = 205
const STRIP_H = 26
const radiusFor = (zhr: number) => 7 + Math.sqrt(zhr) * 1.9

interface Props {
  from: DateKey
  showers: UpcomingShower[]
  selectedId: string
  onSelect: (id: string) => void
}

export function MeteorCalendar({ from, showers, selectedId, onSelect }: Props) {
  const moon = useMemo(() => lunarCalendar(from, DAYS), [from])
  const dayW = W / DAYS

  // Showers that peak close together stack their labels on separate rows.
  const labelLevels = useMemo(() => {
    const levels: number[] = []
    showers.forEach((s, i) => {
      const x = s.daysAway * dayW
      const prevX = i ? showers[i - 1]!.daysAway * dayW : -Infinity
      levels.push(x - prevX < 125 ? ((levels[i - 1] ?? 0) + 1) % 3 : 0)
    })
    return levels
  }, [showers, dayW])

  const months = useMemo(() => {
    const out: Array<{ key: DateKey; x: number }> = []
    for (let i = 0; i < DAYS; i++) {
      const key = addDays(from, i)
      if (key.endsWith('-01') || i === 0) out.push({ key, x: i * dayW })
    }
    return out
  }, [from, dayW])

  return (
    <div className="-mx-5 scrollbar-none overflow-x-auto px-5 pb-4 sm:mx-0 sm:px-0">
      <svg
        viewBox={`0 0 ${W} 270`}
        className="h-auto w-full min-w-[860px]"
        role="group"
        aria-label="Meteor showers over the next year with the moon's brightness underneath"
      >
        {months.map(({ key, x }, i) => (
          <g key={key}>
            <line
              x1={x}
              x2={x}
              y1="28"
              y2={STRIP_Y + STRIP_H}
              stroke="var(--color-night-600)"
              strokeOpacity="0.45"
            />
            {/* The first label would collide with the next month when today is near month end. */}
            {!(i === 0 && (months[1]?.x ?? Infinity) - x < 60) && (
              <text x={x + 6} y="16" className="fill-mist-500 text-[13px]">
                {formatDate(uaeDate(key, 12), { month: 'short' })}
              </text>
            )}
          </g>
        ))}

        <line
          x1="0"
          x2={W}
          y1={BUBBLE_Y}
          y2={BUBBLE_Y}
          stroke="var(--color-night-600)"
          strokeOpacity="0.6"
        />

        {moon.map((d, i) => (
          <rect
            key={d.key}
            x={i * dayW}
            y={STRIP_Y}
            width={dayW + 0.4}
            height={STRIP_H}
            fill="var(--color-star-400)"
            fillOpacity={0.06 + d.fraction * 0.94}
          />
        ))}
        <text x="0" y={STRIP_Y + STRIP_H + 22} className="fill-mist-400 text-[13px]">
          Moon brightness each night: darker means better
        </text>

        {showers.map((s, index) => {
          const x = (s.daysAway + 0.5) * dayW
          const r = radiusFor(s.shower.zhr)
          const level = labelLevels[index] ?? 0
          const selected = s.shower.id === selectedId
          const nearEdge = x > W - 90
          return (
            <g
              key={s.shower.id}
              role="button"
              tabIndex={0}
              aria-pressed={selected}
              aria-label={`${s.shower.name}, peaks ${formatDate(s.peak, { day: 'numeric', month: 'long' })}, up to ${s.shower.zhr} per hour, moon ${Math.round(s.moonFraction * 100)}% lit`}
              onClick={() => onSelect(s.shower.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onSelect(s.shower.id)
                }
              }}
              className="cursor-pointer"
            >
              <line
                x1={x}
                x2={x}
                y1={BUBBLE_Y + r}
                y2={STRIP_Y}
                stroke="var(--color-star-400)"
                strokeOpacity={selected ? 0.7 : 0.2}
                strokeDasharray="2 5"
              />
              <motion.circle
                cx={x}
                cy={BUBBLE_Y}
                initial={{ r: 0 }}
                whileInView={{ r }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                fill="var(--color-star-400)"
                fillOpacity={0.18 + (1 - s.moonFraction) * 0.72}
                stroke="var(--color-star-400)"
                strokeWidth={selected ? 2.5 : 1}
              />
              <text
                x={x}
                y={BUBBLE_Y + 46 + level * 18}
                textAnchor={nearEdge ? 'end' : 'middle'}
                className={cn(
                  'text-[14px]',
                  selected ? 'fill-mist-100 font-medium' : 'fill-mist-300',
                )}
              >
                {s.shower.name}
              </text>
              <circle cx={x} cy={BUBBLE_Y} r={r + 14} fill="transparent" />
            </g>
          )
        })}
      </svg>
      <p className="mt-2 text-sm text-mist-400">
        Bubble size is peak meteors per hour under a perfect sky. A brighter bubble means a darker
        moon on the peak night.
      </p>
    </div>
  )
}
