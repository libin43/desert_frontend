import { Container } from '@/components/ui/Container'
import { Section } from '@/components/ui/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { BookingPanel } from './BookingPanel'
import { CampList } from './CampList'

export function BookingSection() {
  return (
    <Section id="camps" aria-labelledby="camps-title">
      <Container>
        <SectionHeading
          id="camps-title"
          title="Go with someone who knows the sky."
          lede="Every camp has a guide who finds things for you, telescopes you can use, and a driver who knows the track after dark. Choose a camp, then pick the night with the best sky."
        />

        <div className="mt-16 grid grid-cols-1 gap-10 lg:mt-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-14 xl:gap-20">
          <CampList />
          <div className="lg:sticky lg:top-24 lg:self-start">
            <BookingPanel />
          </div>
        </div>
      </Container>
    </Section>
  )
}
