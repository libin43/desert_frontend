import { AnimatePresence, motion } from 'motion/react'
import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { useSite } from '@/hooks/useSite'
import { cn } from '@/lib/cn'
import { BortleGauge } from './BortleGauge'
import { SITES } from './data/sites'
import { UaeMap } from './UaeMap'

export function SiteExplorer() {
  const { site, setSiteId } = useSite()

  return (
    <Section id="sites" aria-labelledby="sites-title">
      <Container>
        <SectionHeading
          id="sites-title"
          title="Pick your dark."
          lede="Dubai's glow reaches further than you would think. Each of these sites trades drive time for darkness, and everything below recalculates for the one you choose."
        />

        <div className="mt-16 grid grid-cols-1 gap-12 lg:mt-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16 xl:grid-cols-[1.1fr_1fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <UaeMap />
          </div>

          <div role="radiogroup" aria-label="Dark-sky site" className="flex flex-col">
            {SITES.map((s) => {
              const selected = s.id === site.id
              return (
                <div key={s.id} className="border-t border-white/12 last:border-b">
                  <button
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setSiteId(s.id)}
                    className="flex w-full items-baseline justify-between gap-6 py-6 text-left"
                  >
                    <span
                      className={cn(
                        'font-display-light text-heading transition-colors',
                        selected ? 'text-star-400' : 'text-mist-300 hover:text-mist-100',
                      )}
                    >
                      {s.name}
                    </span>
                    <span className="shrink-0 text-sm text-mist-400">
                      {s.emirate}, {s.driveFromDubai} from Dubai
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {selected && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="pb-8">
                          <p className="font-display-light text-xl text-mist-100 sm:text-2xl">
                            {s.tagline}
                          </p>
                          <p className="mt-4 max-w-[58ch] text-mist-300">{s.description}</p>

                          <div className="mt-8">
                            <BortleGauge bortle={s.bortle} />
                          </div>

                          <dl className="mt-8 grid grid-cols-3 gap-4">
                            <div>
                              <dt className="text-sm text-mist-400">Elevation</dt>
                              <dd className="font-display-light tabular text-2xl">
                                {s.elevationM.toLocaleString('en-GB')} m
                              </dd>
                            </div>
                            <div>
                              <dt className="text-sm text-mist-400">From Dubai</dt>
                              <dd className="font-display-light tabular text-2xl">
                                {s.distanceFromDubaiKm} km
                              </dd>
                            </div>
                            <div>
                              <dt className="text-sm text-mist-400">Best for</dt>
                              <dd className="text-sm text-mist-100">{s.bestFor}</dd>
                            </div>
                          </dl>

                          <ul className="mt-8 space-y-2 text-mist-300">
                            {s.highlights.map((h) => (
                              <li key={h} className="flex gap-3">
                                <span
                                  aria-hidden="true"
                                  className="mt-[0.7em] size-1 shrink-0 rounded-full bg-star-400"
                                />
                                {h}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </div>
      </Container>
    </Section>
  )
}
