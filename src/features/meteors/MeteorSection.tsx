import { AnimatePresence, motion } from 'motion/react'
import { useMemo, useState } from 'react'
import { Container } from '@/components/ui/Container'
import { MoonDisc } from '@/components/ui/MoonDisc'
import { Section } from '@/components/ui/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { useSite } from '@/hooks/useSite'
import { expectedHourlyRate } from '@/lib/meteors'
import { formatDate, tonightKey } from '@/lib/time'
import { getMoonIllumination } from 'suncalc'
import { SHOWERS } from './data/showers'
import { MeteorCalendar } from './MeteorCalendar'
import { moonVerdict, upcomingShowers } from './upcoming'

export function MeteorSection() {
  const { site } = useSite()
  const from = useMemo(() => tonightKey(), [])
  const showers = useMemo(() => upcomingShowers(SHOWERS, from), [from])
  const [selectedId, setSelectedId] = useState(showers[0]!.shower.id)
  const current = showers.find((s) => s.shower.id === selectedId) ?? showers[0]!

  const { shower } = current
  const verdict = moonVerdict(current.moonFraction)
  const rate = expectedHourlyRate({
    zhr: shower.zhr,
    bortle: site.bortle,
    moonFraction: current.moonFraction,
  })
  const moon = getMoonIllumination(current.peak)
  const when =
    current.daysAway === 0
      ? 'Tonight'
      : current.daysAway === 1
        ? 'Tomorrow'
        : `In ${current.daysAway} days`

  return (
    <Section id="meteors" aria-labelledby="meteors-title">
      <Container>
        <SectionHeading
          id="meteors-title"
          title="Next up in the sky."
          lede="Eight reliable showers a year. Pick one to see when it peaks, how dark the moon will be, and how many meteors you could count from your site."
        />

        <div className="mt-16 lg:mt-24">
          <MeteorCalendar
            from={from}
            showers={showers}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </div>

        <div className="mt-12 grid grid-cols-1 gap-12 border-t border-white/12 pt-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={shower.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="text-mist-300">
                {when},{' '}
                {formatDate(current.peak, { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
              <h3 className="font-display-light mt-2 text-title text-star-400">{shower.name}</h3>
              <p className="mt-6 max-w-[50ch] text-lg text-mist-300">{shower.note}</p>
            </motion.div>
          </AnimatePresence>

          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
            <dl className="grid content-start gap-8">
              <div>
                <dt className="text-sm text-mist-400">From {site.name}, you could count about</dt>
                <dd className="font-display-light tabular text-[clamp(3rem,6vw,4.5rem)] leading-none text-mist-100">
                  {rate}
                  <span className="ml-2 text-xl text-mist-300">an hour</span>
                </dd>
                <dd className="mt-2 text-sm text-mist-500">
                  An estimate from the shower's peak rate of {shower.zhr}, this site's darkness and
                  the moon.
                </dd>
              </div>
              <div>
                <dt className="text-sm text-mist-400">Best time</dt>
                <dd className="text-lg text-mist-100">
                  {shower.bestTime}, facing {shower.radiant}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-mist-400">Comes from</dt>
                <dd className="text-lg text-mist-100">
                  {shower.parent}, at {shower.speedKmS} km/s
                </dd>
              </div>
            </dl>

            <div className="flex items-start gap-5">
              <MoonDisc
                phase={moon.phase}
                fraction={moon.fraction}
                className="w-20 shrink-0"
                label={`Moon on the peak night, ${Math.round(current.moonFraction * 100)}% lit`}
              />
              <div>
                <p className="text-sm text-mist-400">Moon on the peak night</p>
                <p className="font-display-light tabular text-heading">
                  {Math.round(current.moonFraction * 100)}% lit
                </p>
                <p className="mt-2 text-mist-300">{verdict.label}</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}
