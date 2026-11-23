import { Container } from '@/components/ui/Container'
import { Reading } from '@/components/ui/Reading'
import { Section } from '@/components/ui/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { useNightReport } from '@/hooks/useNightReport'
import { useOutlook } from '@/hooks/useOutlook'
import { useSite } from '@/hooks/useSite'
import { formatDuration, formatTime } from '@/lib/time'
import { FactorBars } from './FactorBars'
import { NightWalk } from './NightWalk'
import { OutlookBars } from './OutlookBars'
import { describeMoon, summariseNight } from './summary'
import { VisibilityRing } from './VisibilityRing'

export function TonightSection() {
  const { site } = useSite()
  const { report } = useNightReport(site)
  const { outlook } = useOutlook(site, 14)
  const { night, visibility, meanDarkCloud, forecastSource } = report

  return (
    <>
      <Section id="tonight" aria-labelledby="tonight-title">
        <Container>
          <SectionHeading
            id="tonight-title"
            title={`Tonight over ${site.name}.`}
            lede={summariseNight(report, site.name)}
          />

          <div className="mt-16 grid grid-cols-1 items-center gap-14 lg:mt-24 lg:grid-cols-[minmax(0,24rem)_1fr] lg:gap-24">
            <VisibilityRing visibility={visibility} />

            <div className="grid grid-cols-1 gap-12 sm:grid-cols-2">
              <dl className="grid content-start gap-9">
                <Reading
                  label="Fully dark"
                  value={`${formatTime(night.astronomicalDusk)} to ${formatTime(night.astronomicalDawn)}`}
                  detail={`${formatDuration(night.darkHours)} without any sun glow`}
                />
                <Reading
                  label="Cloud while dark"
                  value={`${Math.round(meanDarkCloud)}%`}
                  detail={
                    forecastSource === 'live'
                      ? 'Live hourly forecast'
                      : 'Seasonal estimate, live forecast unavailable'
                  }
                />
                <Reading
                  label="Moon"
                  value={`${Math.round(night.moonIllumination * 100)}% lit`}
                  detail={describeMoon(report)}
                />
                <Reading
                  label="Sunset"
                  value={formatTime(night.sunset)}
                  detail="Arrive before this to set up in daylight"
                />
              </dl>
              <FactorBars factors={visibility.factors} />
            </div>
          </div>

          <div className="mt-24 lg:mt-32">
            <OutlookBars outlook={outlook} tonight={night.key} />
          </div>
        </Container>
      </Section>

      <NightWalk report={report} siteName={site.name} />
    </>
  )
}
