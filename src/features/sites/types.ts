export type SiteId = 'al-qudra' | 'jebel-jais' | 'liwa'

export interface Site {
  id: SiteId
  name: string
  emirate: string
  lat: number
  lng: number
  /** Bortle dark-sky class (1 darkest – 9 inner city). Approximate, from published light-pollution maps. */
  bortle: number
  elevationM: number
  distanceFromDubaiKm: number
  driveFromDubai: string
  tagline: string
  description: string
  highlights: string[]
  bestFor: string
  /** Typical overnight cloud cover %, used only when the live forecast is unavailable. */
  cloudBaseline: number
}
