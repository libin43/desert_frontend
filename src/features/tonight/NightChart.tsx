import { motion, type MotionValue, useTransform } from 'motion/react'
import { useMemo } from 'react'
import { WINDOW_HOURS, WINDOW_START_HOUR, type TwilightPhase } from '@/lib/astronomy'
import { clamp } from '@/lib/math'
import type { NightReport } from '@/lib/nightReport'

const W = 960
const MOON_LANE = { top: 0, height: 110 }
const SKY_LANE = { top: 126, height: 16 }
const CLOUD_LANE = { top: 160, height: 120 }
const H = 280

const PHASE_COLOR: Record<TwilightPhase, string> = {
  day: '#f1b38f',
  civil: '#e27d9f',
  nautical: '#8b5aa8',
  astronomical: '#4a4aa8',
  night: '#1b2060',
}

/** Horizontal position of sample `i` in chart units. */
const xAt = (i: number, last: number) => (i / last) * W

const MOON_MIN = -10
const MOON_MAX = 90

export function NightChart({
  report,
  progress,
}: {
  report: NightReport
  progress: MotionValue<number>
}) {
  const { samples } = report.night
  const last = samples.length - 1
  const x = (i: number) => xAt(i, last)

  const geometry = useMemo(() => {
    const moonY = (alt: number) =>
      MOON_LANE.height * (1 - clamp((alt - MOON_MIN) / (MOON_MAX - MOON_MIN)))
    const horizonY = moonY(0)

    let moonLine = ''
    let drawing = false
    samples.forEach((s, i) => {
      if (s.moonAltitude < MOON_MIN) {
        drawing = false
        return
      }
      moonLine += `${drawing ? 'L' : 'M'}${xAt(i, last).toFixed(1)},${moonY(s.moonAltitude).toFixed(1)} `
      drawing = true
    })

    const moonArea =
      `M0,${horizonY} ` +
      samples
        .map(
          (s, i) => `L${xAt(i, last).toFixed(1)},${moonY(Math.max(0, s.moonAltitude)).toFixed(1)}`,
        )
        .join(' ') +
      ` L${W},${horizonY} Z`

    const cloudY = (c: number) => CLOUD_LANE.top + CLOUD_LANE.height * (1 - c / 100)
    const cloudLine = report.cloud
      .map((c, i) => `${i ? 'L' : 'M'}${xAt(i, last).toFixed(1)},${cloudY(c).toFixed(1)}`)
      .join(' ')
    const cloudArea = `${cloudLine} L${W},${CLOUD_LANE.top + CLOUD_LANE.height} L0,${CLOUD_LANE.top + CLOUD_LANE.height} Z`

    const bands: Array<{ phase: TwilightPhase; from: number; to: number }> = []
    samples.forEach((s, i) => {
      const prev = bands[bands.length - 1]
      if (prev && prev.phase === s.phase) prev.to = i
      else bands.push({ phase: s.phase, from: i, to: i })
    })

    return { horizonY, moonLine, moonArea, cloudLine, cloudArea, bands }
  }, [samples, report.cloud, last])

  const left = useTransform(progress, (v) => `${clamp(v) * 100}%`)

  const ticks = Array.from({ length: WINDOW_HOURS / 2 + 1 }, (_, i) => ({
    pct: ((i * 2) / WINDOW_HOURS) * 100,
    label: `${String((WINDOW_START_HOUR + i * 2) % 24).padStart(2, '0')}:00`,
  }))

  return (
    <div>
      <div className="relative">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          className="h-[240px] w-full sm:h-[320px]"
          role="img"
          aria-label="Moon height, twilight stages and cloud cover from 18:00 to 06:00"
        >
          <defs>
            <clipPath id="above-horizon">
              <rect x="0" y="0" width={W} height={geometry.horizonY} />
            </clipPath>
            <linearGradient id="cloud-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#c9cdee" stopOpacity="0.4" />
              <stop offset="1" stopColor="#c9cdee" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          <path
            d={geometry.moonArea}
            fill="var(--color-star-400)"
            fillOpacity="0.16"
            clipPath="url(#above-horizon)"
          />
          <line
            x1="0"
            x2={W}
            y1={geometry.horizonY}
            y2={geometry.horizonY}
            stroke="var(--color-mist-500)"
            strokeOpacity="0.5"
            strokeDasharray="3 6"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d={geometry.moonLine}
            fill="none"
            stroke="var(--color-star-400)"
            strokeWidth="2.5"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />

          {geometry.bands.map((b) => (
            <rect
              key={`${b.phase}-${b.from}`}
              x={x(b.from)}
              y={SKY_LANE.top}
              width={x(b.to + 1 > last ? last : b.to + 1) - x(b.from)}
              height={SKY_LANE.height}
              fill={PHASE_COLOR[b.phase]}
            />
          ))}

          <line
            x1="0"
            x2={W}
            y1={CLOUD_LANE.top + CLOUD_LANE.height / 2}
            y2={CLOUD_LANE.top + CLOUD_LANE.height / 2}
            stroke="var(--color-mist-500)"
            strokeOpacity="0.25"
            strokeDasharray="3 6"
            vectorEffect="non-scaling-stroke"
          />
          <path d={geometry.cloudArea} fill="url(#cloud-fill)" />
          <path
            d={geometry.cloudLine}
            fill="none"
            stroke="var(--color-mist-300)"
            strokeWidth="1.8"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <span className="absolute top-0 left-0 text-xs text-star-400">Moon height</span>
        <span className="absolute top-[45%] left-0 -translate-y-full pb-1 text-xs text-mist-300">
          Sky light
        </span>
        <span className="absolute bottom-[41%] left-0 text-xs text-mist-300">Cloud cover</span>

        <motion.div
          aria-hidden="true"
          style={{ left }}
          className="pointer-events-none absolute inset-y-0 right-0 bg-night-950/55"
        />
        <motion.div
          aria-hidden="true"
          style={{ left }}
          className="pointer-events-none absolute inset-y-0 w-px bg-star-400 shadow-[0_0_12px_var(--color-star-400)]"
        />
      </div>

      <div className="tabular relative mt-3 h-4 text-xs text-mist-400" aria-hidden="true">
        {ticks.map((t, i) => (
          <span
            key={t.label}
            className={i % 2 ? 'absolute max-sm:hidden' : 'absolute'}
            style={{
              left: `${t.pct}%`,
              transform:
                i === 0
                  ? 'none'
                  : i === ticks.length - 1
                    ? 'translateX(-100%)'
                    : 'translateX(-50%)',
            }}
          >
            {t.label}
          </span>
        ))}
      </div>
    </div>
  )
}
