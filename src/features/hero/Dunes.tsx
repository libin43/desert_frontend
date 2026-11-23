import { motion, type MotionValue, useTransform } from 'motion/react'

const LAYERS = [
  {
    d: 'M0,230 C140,170 300,250 480,200 S820,120 1020,190 S1330,230 1440,170 L1440,400 L0,400 Z',
    fill: 'url(#dune-back)',
    shift: 70,
  },
  {
    d: 'M0,290 C200,230 360,300 560,260 S900,210 1100,270 S1340,300 1440,250 L1440,400 L0,400 Z',
    fill: 'url(#dune-mid)',
    shift: 36,
  },
  {
    d: 'M0,345 C220,300 420,350 640,325 S1000,290 1200,332 S1380,345 1440,320 L1440,400 L0,400 Z',
    fill: 'var(--color-night-950)',
    shift: 0,
  },
]

/** Three dune ridges. The back ones lag as you scroll away, which gives depth. */
export function Dunes({ progress }: { progress: MotionValue<number> }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-[42svh] min-h-64"
    >
      <svg viewBox="0 0 1440 400" preserveAspectRatio="none" className="size-full overflow-visible">
        <defs>
          <linearGradient id="dune-back" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#5b3f8f" />
            <stop offset="1" stopColor="#1e2563" />
          </linearGradient>
          <linearGradient id="dune-mid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2a2470" />
            <stop offset="1" stopColor="#090c2b" />
          </linearGradient>
        </defs>
        {LAYERS.map((layer, i) => (
          <Ridge key={i} {...layer} progress={progress} />
        ))}
      </svg>
    </div>
  )
}

function Ridge({
  d,
  fill,
  shift,
  progress,
}: {
  d: string
  fill: string
  shift: number
  progress: MotionValue<number>
}) {
  const y = useTransform(progress, [0, 1], [0, shift])
  return <motion.path d={d} fill={fill} style={{ y }} />
}
