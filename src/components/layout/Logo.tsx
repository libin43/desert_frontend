export function Logo() {
  return (
    <span className="flex items-center gap-3">
      <svg viewBox="0 0 32 32" className="size-7" aria-hidden="true">
        <path
          d="M16 3l2.6 10.4L29 16l-10.4 2.6L16 29l-2.6-10.4L3 16l10.4-2.6z"
          fill="var(--color-star-400)"
        />
      </svg>
      <span className="font-display-light text-xl tracking-tight whitespace-nowrap text-mist-100">
        Desert Observatory
      </span>
    </span>
  )
}
