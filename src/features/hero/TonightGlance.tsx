import { SectionLink } from '@/features/navigation/SectionLink'
import { useSite } from '@/hooks/useSite'
import { useNightReport } from '@/hooks/useNightReport'
import { formatTime } from '@/lib/time'
import { moonPhaseName } from '@/lib/astronomy'
import { getMoonIllumination } from 'suncalc'

/** A compact answer to "is tonight any good?" for the hero. */
export function TonightGlance() {
  const { site } = useSite()
  const { report } = useNightReport(site)
  const { visibility, night } = report
  const moon = getMoonIllumination(night.windowStart)

  return (
    <SectionLink
      to="tonight"
      className="group block w-full max-w-sm rounded-3xl border border-white/15 bg-night-950/55 p-6 backdrop-blur-xl transition-colors hover:border-star-400/50"
    >
      <p className="text-sm text-mist-300">Tonight at {site.name}</p>
      <div className="mt-3 flex items-baseline gap-4">
        <span className="font-display-light tabular text-6xl text-star-400">
          {visibility.score}
        </span>
        <span className="font-display-light text-2xl text-mist-100">{visibility.label}</span>
      </div>
      <p className="mt-4 text-sm text-mist-300">
        {moonPhaseName(moon.phase)}, {Math.round(night.moonIllumination * 100)}% lit. Fully dark
        from <span className="tabular text-mist-100">{formatTime(night.astronomicalDusk)}</span> to{' '}
        <span className="tabular text-mist-100">{formatTime(night.astronomicalDawn)}</span>.
      </p>
    </SectionLink>
  )
}
