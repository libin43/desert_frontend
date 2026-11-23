import type { ComponentProps } from 'react'
import { useId } from 'react'
import { cn } from '@/lib/cn'

interface Props extends Omit<ComponentProps<'input'>, 'id'> {
  label: string
  error?: string
  hint?: string
}

export function Field({ label, error, hint, className, ...props }: Props) {
  const id = useId()
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined
  return (
    <div className={className}>
      <label htmlFor={id} className="text-sm text-mist-300">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        className={cn(
          'mt-2 block min-h-12 w-full rounded-xl border bg-night-950/60 px-4 text-mist-100 transition-colors placeholder:text-mist-500',
          error
            ? 'border-venus-500'
            : 'border-white/15 hover:border-white/30 focus:border-star-400',
        )}
        {...props}
      />
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-sm text-venus-400">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="mt-2 text-sm text-mist-500">
            {hint}
          </p>
        )
      )}
    </div>
  )
}
