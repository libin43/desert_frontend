import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { MoonDisc } from '@/components/ui/MoonDisc'
import { buttonClass } from '@/components/ui/buttonClass'
import { SectionLink } from '@/features/navigation/SectionLink'
import { Container } from '@/components/ui/Container'
import { getMoonIllumination } from 'suncalc'
import { Dunes } from './Dunes'
import { TonightGlance } from './TonightGlance'

const EASE = [0.16, 1, 0.3, 1] as const

function Word({ children, delay }: { children: string; delay: number }) {
  return (
    <span className="inline-block overflow-hidden pb-[0.12em] align-bottom">
      <motion.span
        className="inline-block"
        initial={{ y: '105%' }}
        animate={{ y: 0 }}
        transition={{ duration: 1.3, ease: EASE, delay }}
      >
        {children}
      </motion.span>
    </span>
  )
}

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -120])
  const copyOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const moonY = useTransform(scrollYProgress, [0, 1], [0, 160])

  const moon = getMoonIllumination(new Date())

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex min-h-svh flex-col justify-center overflow-hidden pt-28 pb-[34svh] sm:pb-[30svh]"
    >
      <motion.div
        style={{ y: moonY }}
        aria-hidden="true"
        className="absolute top-[14svh] right-[6%] w-[clamp(110px,17vw,260px)] sm:top-[16svh] lg:right-[10%]"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2.4, ease: EASE, delay: 0.3 }}
        >
          <MoonDisc phase={moon.phase} fraction={moon.fraction} glow />
        </motion.div>
      </motion.div>

      <Container className="relative z-10">
        <motion.div style={{ y: copyY, opacity: copyOpacity }}>
          <h1 className="font-display-light text-display text-mist-100">
            <Word delay={0.5}>Find</Word> <Word delay={0.62}>the</Word>
            <br />
            <Word delay={0.78}>dark.</Word>
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 1.5 }}
            className="mt-8 max-w-[44ch] text-lg text-pretty text-mist-300 sm:text-xl"
          >
            Three places in the Emirates where the Milky Way still shows. Check tonight's sky, plan
            around the moon and the next meteor shower, then book a guided camp.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 1.7 }}
            className="mt-10 flex flex-wrap gap-3"
          >
            <SectionLink to="tonight" className={buttonClass('primary')}>
              See tonight's sky
            </SectionLink>
            <SectionLink to="camps" className={buttonClass('ghost')}>
              Book a guided camp
            </SectionLink>
          </motion.div>
        </motion.div>
      </Container>

      <Dunes progress={scrollYProgress} />

      <Container className="absolute inset-x-0 bottom-6 z-10 flex justify-end sm:bottom-10 lg:bottom-14">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.9 }}
          className="w-full sm:w-auto"
        >
          <TonightGlance />
        </motion.div>
      </Container>
    </section>
  )
}
