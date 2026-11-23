import { motion, useScroll, useTransform } from 'motion/react'
import { useMemo, useRef, useState } from 'react'
import { Container } from '@/components/ui/Container'
import { MoonDisc } from '@/components/ui/MoonDisc'
import { Reading } from '@/components/ui/Reading'
import { Section } from '@/components/ui/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { DARK_MOON_THRESHOLD, lunarCalendar, moonPhaseName } from '@/lib/astronomy'
import { formatDate, tonightKey, uaeDate } from '@/lib/time'
import { longestDarkRun } from './darkWindows'
import { LunarStrip } from './LunarStrip'

export function MoonSection() {
  const ref = useRef<HTMLElement>(null)
  const today = useMemo(() => tonightKey(), [])
  const days = useMemo(() => lunarCalendar(today, 30), [today])
  const [selectedKey, setSelectedKey] = useState(today)
  const selected = days.find((d) => d.key === selectedKey) ?? days[0]!
  const run = useMemo(() => longestDarkRun(days), [days])

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [70, -70])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.88, 1, 1.04])

  const dateLabel =
    selectedKey === today
      ? 'Tonight'
      : formatDate(uaeDate(selectedKey, 12), { weekday: 'long', day: 'numeric', month: 'long' })
  const dark = selected.fraction < DARK_MOON_THRESHOLD

  return (
    <Section id="moon" ref={ref} aria-labelledby="moon-title">
      <Container className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-24">
        <motion.div style={{ y, scale }} className="mx-auto w-full max-w-[min(30rem,80vw)]">
          <MoonDisc
            phase={selected.phase}
            fraction={selected.fraction}
            animated
            glow
            label={`${moonPhaseName(selected.phase)}, ${Math.round(selected.fraction * 100)}% lit`}
          />
        </motion.div>

        <div>
          <SectionHeading
            id="moon-title"
            title="Wait for the new moon."
            lede="Moonlight is the biggest thing you can plan around. A bright moon turns the sky grey and hides the Milky Way, so the best nights sit around the new moon."
          />

          <dl className="mt-12 grid grid-cols-3 gap-6">
            <Reading label={dateLabel} value={moonPhaseName(selected.phase)} />
            <Reading label="Lit" value={`${Math.round(selected.fraction * 100)}%`} />
            <Reading
              label="For the Milky Way"
              value={dark ? 'Go' : 'Wait'}
              detail={dark ? 'Moon stays out of the way' : 'Moonlight will wash it out'}
            />
          </dl>

          {run && (
            <p className="mt-10 max-w-[52ch] text-mist-300">
              Darkest stretch in the next 30 days:{' '}
              <span className="text-star-400">
                {formatDate(uaeDate(run.from.key, 12))} to {formatDate(uaeDate(run.to.key, 12))}
              </span>
              , {run.nights} {run.nights === 1 ? 'night' : 'nights'}.
            </p>
          )}

          <div className="mt-8">
            <LunarStrip days={days} selected={selectedKey} onSelect={setSelectedKey} />
            <p className="mt-5 flex items-center gap-2 text-sm text-mist-400">
              <span
                aria-hidden="true"
                className="inline-block size-3 rounded-full ring-1 ring-star-400"
              />
              A gold ring marks a dark-sky night, under 25% lit.
            </p>
          </div>
        </div>
      </Container>
    </Section>
  )
}
