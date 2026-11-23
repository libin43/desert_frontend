/**
 * The UAE observes UTC+4 all year with no daylight saving, so a fixed offset is
 * both correct and lets us compute "tonight" the same way for every visitor,
 * wherever their device clock is set.
 */
export const UAE_TIMEZONE = 'Asia/Dubai'
export const UAE_OFFSET_MINUTES = 240

const HOUR = 3_600_000

/** A calendar date in UAE time, written YYYY-MM-DD. For nights it is the evening's date. */
export type DateKey = string

const timeFormat = new Intl.DateTimeFormat('en-GB', {
  timeZone: UAE_TIMEZONE,
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
})

const partsFormat = new Intl.DateTimeFormat('en-CA', {
  timeZone: UAE_TIMEZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  hourCycle: 'h23',
})

export const formatTime = (date: Date) => timeFormat.format(date)

export function formatDate(
  date: Date,
  options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' },
) {
  return new Intl.DateTimeFormat('en-GB', { timeZone: UAE_TIMEZONE, ...options }).format(date)
}

/** Build a Date from UAE wall-clock components. */
export function uaeDate(key: DateKey, hour = 0, minute = 0): Date {
  const [y, m, d] = key.split('-').map(Number) as [number, number, number]
  return new Date(Date.UTC(y, m - 1, d, hour, minute) - UAE_OFFSET_MINUTES * 60_000)
}

export function toDateKey(date: Date): DateKey {
  const parts = Object.fromEntries(partsFormat.formatToParts(date).map((p) => [p.type, p.value]))
  return `${parts.year}-${parts.month}-${parts.day}`
}

export function addDays(key: DateKey, days: number): DateKey {
  return toDateKey(new Date(uaeDate(key, 12).getTime() + days * 24 * HOUR))
}

/**
 * Which evening counts as "tonight". Before 06:00 we are still in last
 * evening's night, so the key rolls back one day.
 */
export function tonightKey(now: Date = new Date()): DateKey {
  const hour = Number(partsFormat.formatToParts(now).find((p) => p.type === 'hour')?.value)
  const key = toDateKey(now)
  return hour < 6 ? addDays(key, -1) : key
}

export function formatDuration(hours: number) {
  const h = Math.floor(hours)
  const m = Math.round((hours - h) * 60)
  return m === 60 ? `${h + 1}h` : m === 0 ? `${h}h` : `${h}h ${m}m`
}
