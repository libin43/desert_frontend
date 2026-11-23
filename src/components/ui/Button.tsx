import type { ComponentProps } from 'react'
import { buttonClass, type ButtonVariant } from './buttonClass'

export function Button({
  variant,
  className,
  ...props
}: ComponentProps<'button'> & { variant?: ButtonVariant }) {
  return <button className={buttonClass(variant, className)} {...props} />
}
