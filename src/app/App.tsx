import { MotionConfig } from 'motion/react'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { BookingSection } from '@/features/booking/BookingSection'
import { Hero } from '@/features/hero/Hero'
import { MeteorSection } from '@/features/meteors/MeteorSection'
import { MoonSection } from '@/features/moon/MoonSection'
import { SiteExplorer } from '@/features/sites/SiteExplorer'
import { SkyBackdrop } from '@/features/sky/SkyBackdrop'
import { TonightSection } from '@/features/tonight/TonightSection'
import { SectionLink } from '@/features/navigation/SectionLink'
import { useSectionRouting } from '@/features/navigation/useSectionRouting'
import { SiteProvider } from './SiteProvider'

export function App() {
  const activeSection = useSectionRouting()

  return (
    <MotionConfig reducedMotion="user">
      <SiteProvider>
        <SectionLink
          to="sites"
          className="fixed top-3 left-3 z-[60] -translate-y-20 rounded-full bg-star-400 px-5 py-3 text-night-950 focus:translate-y-0"
        >
          Skip to content
        </SectionLink>
        <SkyBackdrop />
        <Header active={activeSection} />
        <main>
          <Hero />
          <SiteExplorer />
          <TonightSection />
          <MoonSection />
          <MeteorSection />
          <BookingSection />
        </main>
        <Footer />
      </SiteProvider>
    </MotionConfig>
  )
}
