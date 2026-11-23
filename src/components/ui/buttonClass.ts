import { cn } from '@/lib/cn'

export type ButtonVariant = 'primary' | 'ghost'

const base =
  'inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-[0.95rem] font-medium transition-[background-color,border-color,transform,opacity] duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-star-400 text-night-950 hover:bg-star-300',
  ghost: 'border border-mist-400/40 text-mist-100 hover:border-mist-300 hover:bg-white/5',
}

export function buttonClass(variant: ButtonVariant = 'primary', className?: string) {
  return cn(base, variants[variant], className)
}
