import { motion } from 'motion/react'
import { DUBAI } from './data/sites'

const BORTLE_NAMES = [
  'Excellent dark sky',
  'Typical dark sky',
  'Rural sky',
  'Rural to suburban',
  'Suburban sky',
  'Bright suburban sky',
  'Suburban to urban',
  'City sky',
  'Inner-city sky',
]

/** Sequential scale: deep indigo (dark) to starlight (bright). Brighter sky means worse stargazing. */
const SEGMENT_COLORS = [
  '#0d1250',
  '#161c63',
  '#232b7c',
  '#3a3a93',
  '#5a4aa3',
  '#8a5aa8',
  '#c46d9f',
  '#e69aa0',
  '#f6e3a6',
]

export function BortleGauge({ bortle }: { bortle: number }) {
  const pos = (n: number) => `${((n - 0.5) / 9) * 100}%`

  return (
    <div
      role="img"
      aria-label={`Bortle class ${bortle} of 9, ${BORTLE_NAMES[bortle - 1]}. Dubai is class ${DUBAI.bortle}.`}
    >
      <div className="relative pt-7 pb-1">
        <motion.div
          initial={false}
          animate={{ left: pos(bortle) }}
          transition={{ type: 'spring', stiffness: 130, damping: 18 }}
          className="absolute top-0 -translate-x-1/2 text-center"
        >
          <span className="block text-sm text-star-400">Class {bortle}</span>
          <span className="mx-auto mt-0.5 block size-0 border-x-[5px] border-t-[6px] border-x-transparent border-t-star-400" />
        </motion.div>
        <div className="flex h-3 overflow-hidden rounded-full">
          {SEGMENT_COLORS.map((color, i) => (
            <div
              key={color}
              className="flex-1"
              style={{ background: color, opacity: i + 1 === bortle ? 1 : 0.55 }}
            />
          ))}
        </div>
      </div>
      <div className="relative mt-1 flex justify-between text-xs text-mist-500">
        <span>Darkest</span>
        <span>Dubai</span>
      </div>
      <p className="mt-2 text-sm text-mist-300">{BORTLE_NAMES[bortle - 1]}</p>
    </div>
  )
}
