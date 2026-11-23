import { AnimatePresence, motion } from 'motion/react'
import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/Button'
import { useOutlook } from '@/hooks/useOutlook'
import { useSite } from '@/hooks/useSite'
import { formatDate, tonightKey, uaeDate } from '@/lib/time'
import { submitBooking } from './bookingService'
import { campForSite } from './data/camps'
import { Field } from './Field'
import { formatAed } from './format'
import { NightPicker } from './NightPicker'
import type { BookingConfirmation } from './types'
import { validateBooking, type BookingErrors } from './validate'

type Status = 'editing' | 'submitting' | 'confirmed'

const ease = [0.16, 1, 0.3, 1] as const

export function BookingPanel() {
  const { site } = useSite()
  const camp = campForSite(site.id)
  const { outlook } = useOutlook(site, 14)

  const [nightKey, setNightKey] = useState(tonightKey())
  const [guests, setGuests] = useState(2)
  const [fields, setFields] = useState({ name: '', email: '', phone: '' })
  const [errors, setErrors] = useState<BookingErrors>({})
  const [status, setStatus] = useState<Status>('editing')
  const [confirmation, setConfirmation] = useState<BookingConfirmation | null>(null)

  const night = outlook.find((o) => o.key === nightKey) ?? outlook[0]!
  const maxGuests = camp.maxGuests
  const safeGuests = Math.min(guests, maxGuests)
  const total = camp.pricePerGuestAed * safeGuests
  const nightLabel = formatDate(uaeDate(night.key, 12), {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  const set = (key: keyof typeof fields) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setFields((f) => ({ ...f, [key]: e.target.value }))

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    const found = validateBooking(fields)
    setErrors(found)
    if (Object.keys(found).length) return

    setStatus('submitting')
    const result = await submitBooking(
      { campId: camp.id, nightKey: night.key, guests: safeGuests, ...fields },
      camp,
    )
    setConfirmation(result)
    setStatus('confirmed')
  }

  function reset() {
    setStatus('editing')
    setConfirmation(null)
    setFields({ name: '', email: '', phone: '' })
  }

  return (
    <div className="rounded-[2rem] border border-white/15 bg-night-950/60 p-6 backdrop-blur-xl sm:p-10">
      <AnimatePresence mode="wait" initial={false}>
        {status === 'confirmed' && confirmation ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease }}
            role="status"
          >
            <h3 className="font-display-light text-title text-star-400">You're in.</h3>
            <p className="mt-4 max-w-[44ch] text-lg text-mist-300">
              {camp.name} at {site.name}, {nightLabel}, for {confirmation.request.guests}{' '}
              {confirmation.request.guests === 1 ? 'guest' : 'guests'}.
            </p>
            <dl className="mt-8 grid grid-cols-2 gap-6">
              <div>
                <dt className="text-sm text-mist-400">Reference</dt>
                <dd className="font-display-light tabular text-2xl">{confirmation.reference}</dd>
              </div>
              <div>
                <dt className="text-sm text-mist-400">Total</dt>
                <dd className="font-display-light tabular text-2xl">
                  {formatAed(confirmation.totalAed)}
                </dd>
              </div>
            </dl>
            <p className="mt-8 text-mist-300">
              Meet at {camp.startsAt}. Wear layers: desert nights are colder than they look. Details
              go to <span className="text-mist-100">{confirmation.request.email}</span>.
            </p>
            <Button variant="ghost" className="mt-8" onClick={reset}>
              Book another night
            </Button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={onSubmit}
            noValidate
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            <div>
              <h3 className="font-display-light text-heading">
                {camp.name}, {site.name}
              </h3>
              <p className="mt-1 text-sm text-mist-400">
                Each night shows its sky score under the date.
              </p>
            </div>

            <fieldset className="min-w-0">
              <legend className="mb-3 text-sm text-mist-300">Night</legend>
              <NightPicker outlook={outlook} value={night.key} onChange={setNightKey} />
              <p className="mt-3 text-sm text-mist-300">
                {nightLabel}: {night.report.visibility.label.toLowerCase()} sky, moon{' '}
                {Math.round(night.report.night.moonIllumination * 100)}% lit.
              </p>
            </fieldset>

            <fieldset className="min-w-0">
              <legend className="mb-3 text-sm text-mist-300">Guests</legend>
              <div className="flex items-center gap-5">
                <StepButton
                  label="Remove a guest"
                  disabled={safeGuests <= 1}
                  onClick={() => setGuests(safeGuests - 1)}
                >
                  −
                </StepButton>
                <output
                  aria-live="polite"
                  className="font-display-light tabular w-8 text-center text-4xl"
                >
                  {safeGuests}
                </output>
                <StepButton
                  label="Add a guest"
                  disabled={safeGuests >= maxGuests}
                  onClick={() => setGuests(safeGuests + 1)}
                >
                  +
                </StepButton>
                <span className="text-sm text-mist-500">Up to {maxGuests}</span>
              </div>
            </fieldset>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Full name"
                name="name"
                autoComplete="name"
                value={fields.name}
                onChange={set('name')}
                error={errors.name}
                className="sm:col-span-2"
              />
              <Field
                label="Email"
                name="email"
                type="email"
                autoComplete="email"
                value={fields.email}
                onChange={set('email')}
                error={errors.email}
              />
              <Field
                label="Phone (optional)"
                name="phone"
                type="tel"
                autoComplete="tel"
                value={fields.phone}
                onChange={set('phone')}
                error={errors.phone}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-5 border-t border-white/12 pt-6">
              <p>
                <span className="text-sm text-mist-400">Total</span>
                <span className="font-display-light tabular block text-4xl">
                  {formatAed(total)}
                </span>
              </p>
              <Button type="submit" disabled={status === 'submitting'} className="min-w-44">
                {status === 'submitting' ? 'Reserving…' : 'Reserve camp'}
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}

function StepButton({
  label,
  children,
  ...props
}: {
  label: string
  children: string
  disabled: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className="grid size-12 place-items-center rounded-full border border-white/20 text-2xl text-mist-100 transition-colors hover:border-star-400 disabled:pointer-events-none disabled:opacity-30"
      {...props}
    >
      {children}
    </button>
  )
}
