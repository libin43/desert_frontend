import { useMotionValueEvent, useScroll } from 'motion/react'
import { useRef, useState } from 'react'
import { Container } from '@/components/ui/Container'
import { Reading } from '@/components/ui/Reading'
import { TWILIGHT_LABEL, TWILIGHT_NOTE } from '@/lib/astronomy'
import { skyTone } from '@/lib/color'
import { clamp } from '@/lib/math'
import type { NightReport } from '@/lib/nightReport'
import { formatTime } from '@/lib/time'
import { NightChart } from './NightChart'

/**
 * Scroll-driven story of the night. The page pins while the visitor scrolls,
 * and scroll position becomes the time of night: sky colour, readouts and the
 * playhead all follow.
 */
export function NightWalk({ report, siteName }: { report: NightReport; siteName: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const last = report.night.samples.length - 1
  const [index, setIndex] = useState(0)

  useMotionValueEvent(scrollYProgress, 'change', (v) => setIndex(Math.round(clamp(v) * last)))

  const sample = report.night.samples[index] ?? report.night.samples[0]!
  const cloud = Math.round(report.cloud[index] ?? 0)
  const tone = skyTone(sample.sunAltitude)

  return (
    <div ref={ref} className="relative h-[300svh]" aria-labelledby="night-walk-title">
      <div className="sticky top-0 flex h-svh items-center overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black_14%,black_86%,transparent)] opacity-90"
          style={{ background: `linear-gradient(to top, ${tone.horizon}, ${tone.zenith} 75%)` }}
        />
        <div aria-hidden="true" className="absolute inset-0 bg-night-950/30" />

        <Container className="relative grid w-full grid-cols-1 gap-8 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:items-center lg:gap-16">
          <div>
            <h3 id="night-walk-title" className="text-lg text-mist-100">
              A night at {siteName}
            </h3>
            <p
              className="font-display-light tabular mt-2 text-[clamp(4.5rem,13vw,9.5rem)] leading-[0.9] tracking-tight text-mist-100"
              aria-live="off"
            >
              {formatTime(sample.time)}
            </p>
            <p className="font-display-light mt-3 text-2xl text-star-400">
              {TWILIGHT_LABEL[sample.phase]}
            </p>
            <p className="mt-2 max-w-[34ch] text-mist-100/85">{TWILIGHT_NOTE[sample.phase]}</p>

            <dl className="mt-8 grid grid-cols-3 gap-4">
              <Reading label="Cloud" value={`${cloud}%`} />
              <Reading
                label="Sun"
                value={`${Math.round(sample.sunAltitude)}°`}
                detail={sample.sunAltitude > 0 ? 'Above' : 'Below'}
              />
              <Reading
                label="Moon"
                value={`${Math.round(sample.moonAltitude)}°`}
                detail={sample.moonAltitude > 0 ? 'Above' : 'Below'}
              />
            </dl>
          </div>

          <div>
            <NightChart report={report} progress={scrollYProgress} />
            <p className="mt-6 text-sm text-mist-100/75">
              Keep scrolling to move through the night, from 18:00 to 06:00.
            </p>
          </div>
        </Container>
      </div>
    </div>
  )
}
