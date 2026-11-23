import { Container } from '../ui/Container'
import { Logo } from './Logo'

export function Footer() {
  return (
    <footer className="border-t border-white/10 py-16">
      <Container className="grid grid-cols-1 gap-12 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <Logo />
          <p className="mt-6 max-w-[48ch] text-mist-400">
            Go out after dark, give your eyes twenty minutes, and look up. Keep headlights off and
            screens dim at the site, and take everything you brought back with you.
          </p>
        </div>
        <dl className="grid grid-cols-1 gap-6 text-sm text-mist-400 sm:grid-cols-2">
          <div>
            <dt className="text-mist-300">Where the data comes from</dt>
            <dd className="mt-2">
              Sun and moon positions are calculated on your device with SunCalc. Cloud cover is
              hourly forecast data from Open-Meteo. Bortle classes are approximate.
            </dd>
          </div>
          <div>
            <dt className="text-mist-300">About the camps</dt>
            <dd className="mt-2">
              Camps, prices and the booking flow are sample content for this concept.
            </dd>
          </div>
        </dl>
      </Container>
    </footer>
  )
}
