import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'

/** Page gutter and max width, wide enough to use big desktop monitors. */
export function Container({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'mx-auto w-full max-w-[1320px] px-5 sm:px-8 lg:px-12 2xl:max-w-[1640px]',
        className,
      )}
      {...props}
    />
  )
}
