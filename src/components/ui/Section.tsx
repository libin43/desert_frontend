import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'

/** Vertical rhythm for every page section lives here and nowhere else. */
export function Section({ className, ...props }: ComponentProps<'section'>) {
  return (
    <section
      className={cn('relative scroll-mt-20 overflow-x-clip py-24 sm:py-32 lg:py-40', className)}
      {...props}
    />
  )
}
