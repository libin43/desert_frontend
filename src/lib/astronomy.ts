import { getMoonIllumination, getMoonPosition, getMoonTimes, getPosition, getTimes } from 'suncalc'
import { addDays, UAE_OFFSET_MINUTES, uaeDate, type DateKey } from './time'

export interface GeoPoint {
  lat: number
  lng: number
}

export type TwilightPhase = 'day' | 'civil' | 'nautical' | 'astronomical' | 'night'

export const TWILIGHT_LABEL: Record<TwilightPhase, string> = {
  day: 'Daylight',
  civil: 'Civil twilight',
  nautical: 'Nautical twilight',
  astronomical: 'Astronomical twilight',
  night: 'Full night',
}

export const TWILIGHT_NOTE: Record<TwilightPhase, string> = {
  day: 'The sun is still up. Pack the car and watch the light go.',
  civil: 'Venus and Jupiter appear first, low in the glow.',
  nautical: 'The brightest stars show. The horizon still holds colour.',
  astronomical: 'Fainter stars arrive as the last glow drains away.',
  night: 'Fully dark. The Milky Way is at its best if the moon is down.',
}

export function twilightPhase(sunAltitude: number): TwilightPhase {
  if (sunAltitude > -0.833) return 'day'
  if (sunAltitude > -6) return 'civil'
  if (sunAltitude > -12) return 'nautical'
  if (sunAltitude > -18) return 'astronomical'
  return 'night'
}

export interface NightSample {
  time: Date
  /** Hours since the window opened (18:00). */
  hour: number
  sunAltitude: number
  moonAltitude: number
  phase: TwilightPhase
}

export interface MoonEvent {
  type: 'rise' | 'set'
  time: Date
}

export interface NightSummary {
  key: DateKey
  windowStart: Date
  windowEnd: Date
  sunset: Date
  astronomicalDusk: Date
  astronomicalDawn: Date
  darkHours: number
  moonIllumination: number
  /** Share of fully-dark time with the moon above the horizon, 0–1. */
  moonUpFraction: number
  moonEvents: MoonEvent[]
  samples: NightSample[]
}

/** The viewing window runs from 18:00 to 06:00 UAE time. */
export const WINDOW_START_HOUR = 18
export const WINDOW_HOURS = 12
const SAMPLE_MINUTES = 15

export function computeNight(point: GeoPoint, key: DateKey): NightSummary {
  const windowStart = uaeDate(key, WINDOW_START_HOUR)
  const windowEnd = new Date(windowStart.getTime() + WINDOW_HOURS * 3_600_000)

  const today = getTimes(uaeDate(key, 12), point.lat, point.lng, 0, UAE_OFFSET_MINUTES)
  const tomorrow = getTimes(
    uaeDate(addDays(key, 1), 12),
    point.lat,
    point.lng,
    0,
    UAE_OFFSET_MINUTES,
  )

  const steps = (WINDOW_HOURS * 60) / SAMPLE_MINUTES
  const samples: NightSample[] = Array.from({ length: steps + 1 }, (_, i) => {
    const time = new Date(windowStart.getTime() + i * SAMPLE_MINUTES * 60_000)
    const sunAltitude = getPosition(time, point.lat, point.lng).altitude
    return {
      time,
      hour: (i * SAMPLE_MINUTES) / 60,
      sunAltitude,
      moonAltitude: getMoonPosition(time, point.lat, point.lng).altitude,
      phase: twilightPhase(sunAltitude),
    }
  })

  const dark = samples.filter((s) => s.phase === 'night')
  const moonUp = dark.filter((s) => s.moonAltitude > 0)

  const events: MoonEvent[] = [key, addDays(key, 1)].flatMap((day) => {
    const t = getMoonTimes(uaeDate(day, 12), point.lat, point.lng, UAE_OFFSET_MINUTES)
    return [
      t.rise && { type: 'rise' as const, time: t.rise },
      t.set && { type: 'set' as const, time: t.set },
    ].filter((e): e is MoonEvent => Boolean(e))
  })

  return {
    key,
    windowStart,
    windowEnd,
    sunset: today.sunset ?? windowStart,
    astronomicalDusk: today.night ?? windowStart,
    astronomicalDawn: tomorrow.nightEnd ?? windowEnd,
    darkHours: (dark.length * SAMPLE_MINUTES) / 60,
    moonIllumination: getMoonIllumination(uaeDate(addDays(key, 1), 0)).fraction,
    moonUpFraction: dark.length ? moonUp.length / dark.length : 0,
    moonEvents: events
      .filter((e) => e.time >= windowStart && e.time <= windowEnd)
      .sort((a, b) => a.time.getTime() - b.time.getTime()),
    samples,
  }
}

export interface MoonDay {
  key: DateKey
  fraction: number
  phase: number
  waxing: boolean
}

/** Moon state at local midnight ending the evening `key`, for each of `days` nights. */
export function moonAt(key: DateKey): MoonDay {
  const m = getMoonIllumination(uaeDate(addDays(key, 1), 0))
  return { key, fraction: m.fraction, phase: m.phase, waxing: m.waxing }
}

export function lunarCalendar(from: DateKey, days: number): MoonDay[] {
  return Array.from({ length: days }, (_, i) => moonAt(addDays(from, i)))
}

export function moonPhaseName(phase: number): string {
  const p = ((phase % 1) + 1) % 1
  if (p < 0.03 || p >= 0.97) return 'New moon'
  if (p < 0.22) return 'Waxing crescent'
  if (p < 0.28) return 'First quarter'
  if (p < 0.47) return 'Waxing gibbous'
  if (p < 0.53) return 'Full moon'
  if (p < 0.72) return 'Waning gibbous'
  if (p < 0.78) return 'Last quarter'
  return 'Waning crescent'
}

/** Nights where moonlight will not wash out the Milky Way. */
export const DARK_MOON_THRESHOLD = 0.25
