import { useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'

interface Star {
  x: number
  y: number
  r: number
  depth: number
  phase: number
  speed: number
  warm: number
}

const WARM = [251, 239, 196]
const COOL = [196, 208, 255]

function makeStars(width: number, height: number): Star[] {
  const count = Math.min(900, Math.max(260, Math.round((width * height) / 2600)))
  return Array.from({ length: count }, () => {
    const depth = Math.random()
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      r: 0.3 + depth ** 2.4 * 1.5,
      depth,
      phase: Math.random() * Math.PI * 2,
      speed: 0.4 + Math.random() * 1.4,
      warm: Math.random(),
    }
  })
}

/**
 * Full-viewport starfield. Stars drift at different rates as you scroll
 * (depth), twinkle slowly, and a single shooting star crosses every so often.
 */
export function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    let width = 0
    let height = 0
    let stars: Star[] = []
    let frame = 0
    let shooting: { x: number; y: number; vx: number; vy: number; born: number } | null = null
    let nextShot = performance.now() + 6000

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      stars = makeStars(width, height)
      draw(performance.now())
    }

    function draw(now: number) {
      ctx!.clearRect(0, 0, width, height)
      const scroll = window.scrollY
      const t = now / 1000

      for (const s of stars) {
        const y = (((s.y - scroll * (0.03 + s.depth * 0.12)) % height) + height) % height
        const twinkle = reduced ? 0.85 : 0.65 + 0.35 * Math.sin(t * s.speed + s.phase)
        const alpha = (0.25 + s.depth * 0.75) * twinkle
        const c = WARM.map((w, i) => Math.round(w + (COOL[i]! - w) * (1 - s.warm)))
        ctx!.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${alpha.toFixed(3)})`
        ctx!.beginPath()
        ctx!.arc(s.x, y, s.r, 0, Math.PI * 2)
        ctx!.fill()
      }

      if (!reduced) {
        if (!shooting && now > nextShot) {
          shooting = {
            x: width * (0.2 + Math.random() * 0.6),
            y: height * (0.05 + Math.random() * 0.3),
            vx: 0.9 + Math.random() * 0.4,
            vy: 0.35 + Math.random() * 0.2,
            born: now,
          }
        }
        if (shooting) {
          const age = now - shooting.born
          if (age > 1100) {
            shooting = null
            nextShot = now + 9000 + Math.random() * 9000
          } else {
            const head = {
              x: shooting.x + shooting.vx * age * 0.7,
              y: shooting.y + shooting.vy * age * 0.7,
            }
            const tail = { x: head.x - shooting.vx * 130, y: head.y - shooting.vy * 130 }
            const g = ctx!.createLinearGradient(tail.x, tail.y, head.x, head.y)
            g.addColorStop(0, 'rgba(251,239,196,0)')
            g.addColorStop(1, `rgba(251,239,196,${(1 - age / 1100).toFixed(3)})`)
            ctx!.strokeStyle = g
            ctx!.lineWidth = 1.4
            ctx!.beginPath()
            ctx!.moveTo(tail.x, tail.y)
            ctx!.lineTo(head.x, head.y)
            ctx!.stroke()
          }
        }
      }
    }

    const loop = (now: number) => {
      if (!document.hidden) draw(now)
      frame = requestAnimationFrame(loop)
    }

    resize()
    window.addEventListener('resize', resize)
    if (reduced) window.addEventListener('scroll', () => draw(performance.now()), { passive: true })
    else frame = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
    }
  }, [reduced])

  return <canvas ref={canvasRef} className="animate-sky-in absolute inset-0 size-full" />
}
