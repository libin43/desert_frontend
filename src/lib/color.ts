import { clamp } from './math'

type RGB = [number, number, number]

const hexToRgb = (hex: string): RGB => {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

const mix = (a: RGB, b: RGB, t: number): RGB => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
]

const toCss = ([r, g, b]: RGB) => `rgb(${Math.round(r)} ${Math.round(g)} ${Math.round(b)})`

export interface SkyTone {
  horizon: string
  zenith: string
}

/** Sun altitude → [altitude, horizon colour, zenith colour] stops. */
const STOPS: Array<[number, RGB, RGB]> = [
  [4, hexToRgb('#e9a48f'), hexToRgb('#5a5fb0')],
  [0, hexToRgb('#e27d9f'), hexToRgb('#4a4aa8')],
  [-6, hexToRgb('#8b5aa8'), hexToRgb('#232570')],
  [-12, hexToRgb('#2e2a6e'), hexToRgb('#0f1342')],
  [-18, hexToRgb('#101650'), hexToRgb('#04051a')],
]

/** A sky gradient for the given sun altitude (degrees), blended between twilight stops. */
export function skyTone(sunAltitude: number): SkyTone {
  const alt = clamp(sunAltitude, -18, 4)
  for (let i = 0; i < STOPS.length - 1; i++) {
    const [hiAlt, hiH, hiZ] = STOPS[i]!
    const [loAlt, loH, loZ] = STOPS[i + 1]!
    if (alt <= hiAlt && alt >= loAlt) {
      const t = (hiAlt - alt) / (hiAlt - loAlt)
      return { horizon: toCss(mix(hiH, loH, t)), zenith: toCss(mix(hiZ, loZ, t)) }
    }
  }
  const [, h, z] = STOPS[STOPS.length - 1]!
  return { horizon: toCss(h), zenith: toCss(z) }
}
