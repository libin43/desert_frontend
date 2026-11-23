import { motion } from 'motion/react'
import { useId, type KeyboardEvent } from 'react'
import { useSite } from '@/hooks/useSite'
import { DUBAI, SITES } from './data/sites'

/** Rough UAE outline as [lng, lat]. Schematic: it is here to place things, not to survey. */
const OUTLINE: Array<[number, number]> = [
  [51.58, 24.25],
  [52.0, 24.12],
  [52.6, 24.18],
  [53.2, 24.15],
  [53.9, 24.2],
  [54.37, 24.5],
  [54.7, 24.78],
  [55.05, 25.0],
  [55.27, 25.28],
  [55.45, 25.42],
  [55.75, 25.58],
  [55.95, 25.8],
  [56.05, 26.07],
  [56.2, 25.95],
  [56.27, 25.62],
  [56.36, 25.3],
  [56.37, 24.95],
  [56.1, 24.65],
  [55.85, 24.35],
  [55.8, 24.05],
  [55.6, 23.8],
  [55.3, 23.4],
  [55.2, 22.9],
  [55.0, 22.65],
  [54.2, 22.6],
  [53.2, 22.7],
  [52.4, 22.95],
  [52.0, 23.0],
  [51.7, 23.8],
]

/** Light-pollution sources. Radius is in map units and roughly follows city size. */
const CITIES = [
  { name: 'Dubai', lng: 55.3, lat: 25.25, glow: 78 },
  { name: 'Abu Dhabi', lng: 54.37, lat: 24.47, glow: 62 },
  { name: 'Ras Al Khaimah', lng: 55.95, lat: 25.78, glow: 30 },
  { name: 'Al Ain', lng: 55.76, lat: 24.2, glow: 34 },
  { name: 'Fujairah', lng: 56.33, lat: 25.12, glow: 22 },
]

const W = 650
const H = 480
const K = 140
const LNG0 = 51.35
const LAT0 = 26.3

const project = (lng: number, lat: number): [number, number] => [
  (lng - LNG0) * 0.91 * K,
  (LAT0 - lat) * K,
]

const outlinePath =
  OUTLINE.map(([lng, lat], i) => {
    const [x, y] = project(lng, lat)
    return `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ') + ' Z'

export function UaeMap() {
  const { site, setSiteId } = useSite()
  const uid = useId()
  const [dx, dy] = project(DUBAI.lng, DUBAI.lat)
  const [sx, sy] = project(site.lng, site.lat)

  const onKey = (e: KeyboardEvent, id: (typeof SITES)[number]['id']) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setSiteId(id)
    }
  }

  return (
    <figure className="m-0">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="group"
        aria-label="Schematic map of the UAE showing city light glow and three dark-sky sites"
      >
        <defs>
          <radialGradient id={`${uid}-glow`}>
            <stop offset="0" stopColor="#f6d6a0" stopOpacity="0.85" />
            <stop offset="0.35" stopColor="#e27d9f" stopOpacity="0.38" />
            <stop offset="1" stopColor="#e27d9f" stopOpacity="0" />
          </radialGradient>
          <clipPath id={`${uid}-land`}>
            <path d={outlinePath} />
          </clipPath>
        </defs>

        <path
          d={outlinePath}
          fill="var(--color-night-900)"
          stroke="var(--color-night-600)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        <g>
          {CITIES.map((c) => {
            const [x, y] = project(c.lng, c.lat)
            return <circle key={c.name} cx={x} cy={y} r={c.glow} fill={`url(#${uid}-glow)`} />
          })}
        </g>

        <g className="fill-mist-400 text-[17px]" aria-hidden="true">
          {CITIES.slice(0, 2).map((c) => {
            const [x, y] = project(c.lng, c.lat)
            return (
              <g key={c.name}>
                <circle cx={x} cy={y} r="2.5" fill="var(--color-star-300)" />
                <text x={x + 10} y={y - 10}>
                  {c.name}
                </text>
              </g>
            )
          })}
        </g>

        <motion.line
          x1={dx}
          y1={dy}
          animate={{ x2: sx, y2: sy }}
          initial={false}
          transition={{ type: 'spring', stiffness: 80, damping: 18 }}
          stroke="var(--color-star-400)"
          strokeOpacity="0.55"
          strokeDasharray="2 6"
          strokeLinecap="round"
        />

        <motion.circle
          r="24"
          fill="none"
          stroke="var(--color-star-400)"
          strokeWidth="1.5"
          initial={false}
          animate={{ cx: sx, cy: sy }}
          transition={{ type: 'spring', stiffness: 120, damping: 16 }}
        />

        {SITES.map((s) => {
          const [x, y] = project(s.lng, s.lat)
          const selected = s.id === site.id
          return (
            <g
              key={s.id}
              role="button"
              tabIndex={0}
              aria-pressed={selected}
              aria-label={`${s.name}, Bortle ${s.bortle}`}
              onClick={() => setSiteId(s.id)}
              onKeyDown={(e) => onKey(e, s.id)}
              className="cursor-pointer outline-offset-4"
            >
              <circle cx={x} cy={y} r="26" fill="transparent" />
              <circle cx={x} cy={y} r={selected ? 7 : 5.5} fill="var(--color-star-400)" />
              <text
                x={x + (s.id === 'jebel-jais' ? -16 : 18)}
                y={y + 4}
                textAnchor={s.id === 'jebel-jais' ? 'end' : 'start'}
                className={
                  selected ? 'fill-mist-100 text-[19px] font-medium' : 'fill-mist-300 text-[17px]'
                }
              >
                {s.name}
              </text>
            </g>
          )
        })}
      </svg>
      <figcaption className="mt-3 text-sm text-mist-500">
        The pink glow is city light. Dark-sky sites sit well outside it. Schematic, not to scale.
      </figcaption>
    </figure>
  )
}
