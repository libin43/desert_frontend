import { clamp } from './math'
import { UAE_OFFSET_MINUTES } from './time'

const HOUR = 3_600_000

export interface CloudForecast {
  /** `live` comes from Open-Meteo, `estimate` is a seasonal fallback. */
  source: 'live' | 'estimate'
  /** Cloud cover % keyed by whole hours since the Unix epoch. */
  hours: Map<number, number>
}

interface OpenMeteoResponse {
  hourly: { time: string[]; cloud_cover: number[] }
}

const cache = new Map<string, Promise<CloudForecast>>()

/** Open-Meteo returns local-time strings without an offset, e.g. "2026-11-23T14:00". */
function parseLocalHour(iso: string): number {
  const [date = '', time = '00:00'] = iso.split('T')
  const [y, m, d] = date.split('-').map(Number) as [number, number, number]
  const [h] = time.split(':').map(Number) as [number]
  return Math.floor((Date.UTC(y, m - 1, d, h) - UAE_OFFSET_MINUTES * 60_000) / HOUR)
}

async function fetchLive(lat: number, lng: number, signal: AbortSignal): Promise<CloudForecast> {
  const url = new URL('https://api.open-meteo.com/v1/forecast')
  url.search = new URLSearchParams({
    latitude: lat.toFixed(2),
    longitude: lng.toFixed(2),
    hourly: 'cloud_cover',
    timezone: 'Asia/Dubai',
    forecast_days: '14',
  }).toString()

  const res = await fetch(url, { signal })
  if (!res.ok) throw new Error(`Forecast request failed: ${res.status}`)
  const data = (await res.json()) as OpenMeteoResponse

  const hours = new Map<number, number>()
  data.hourly.time.forEach((t, i) => {
    const cover = data.hourly.cloud_cover[i]
    if (typeof cover === 'number') hours.set(parseLocalHour(t), cover)
  })
  return { source: 'live', hours }
}

/** Loads (and memoises) a 14-day cloud forecast; never rejects. */
export function loadForecast(siteId: string, lat: number, lng: number): Promise<CloudForecast> {
  const cached = cache.get(siteId)
  if (cached) return cached

  const request = (async (): Promise<CloudForecast> => {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 7000)
    try {
      return await fetchLive(lat, lng, controller.signal)
    } catch {
      return { source: 'estimate', hours: new Map() }
    } finally {
      clearTimeout(timeout)
    }
  })()

  cache.set(siteId, request)
  return request
}

/** Deterministic pseudo-random in [0, 1) so the fallback is stable between renders. */
function hash(seed: string): number {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619)
  return ((h >>> 0) % 10_000) / 10_000
}

/** UAE skies are clear most nights; mountains collect more cloud. */
export function estimateCloud(siteId: string, hourIndex: number, baseline = 18): number {
  const day = Math.floor(hourIndex / 24)
  const dayMood = hash(`${siteId}:${day}`)
  const wobble = hash(`${siteId}:${hourIndex}`) * 10
  return clamp(baseline + dayMood * dayMood * 55 + wobble, 0, 100)
}

/** Cloud cover % at an instant, interpolating between forecast hours. */
export function cloudAt(forecast: CloudForecast, time: Date, siteId: string, baseline?: number) {
  const exact = time.getTime() / HOUR
  const lo = Math.floor(exact)
  const frac = exact - lo
  const a = forecast.hours.get(lo) ?? estimateCloud(siteId, lo, baseline)
  const b = forecast.hours.get(lo + 1) ?? estimateCloud(siteId, lo + 1, baseline)
  return a + (b - a) * frac
}
