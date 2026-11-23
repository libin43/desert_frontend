import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface Props {
  label: string
  value: ReactNode
  detail?: ReactNode
  className?: string
}

/** A labelled figure: small label, display-sized value, optional supporting line. */
export function Reading({ label, value, detail, className }: Props) {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <dt className="text-sm text-mist-400">{label}</dt>
      <dd className="font-display-light tabular text-heading text-mist-100">{value}</dd>
      {detail && <dd className="text-sm text-mist-400">{detail}</dd>}
    </div>
  )
}
