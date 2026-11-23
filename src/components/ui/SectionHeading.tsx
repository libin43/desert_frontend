import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface Props {
  id?: string
  title: ReactNode
  lede?: ReactNode
  className?: string
}

export function SectionHeading({ id, title, lede, className }: Props) {
  return (
    <header className={cn('max-w-3xl', className)}>
      <h2 id={id} className="font-display-light text-title text-balance text-mist-100">
        {title}
      </h2>
      {lede && (
        <p className="mt-6 max-w-[56ch] text-lg text-pretty text-mist-300 sm:text-xl">{lede}</p>
      )}
    </header>
  )
}
