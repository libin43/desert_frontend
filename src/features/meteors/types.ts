export interface MeteorShower {
  id: string
  name: string
  /** Peak date, month 1–12. Peaks drift by about a day each year. */
  month: number
  day: number
  /** Zenithal hourly rate under a perfect sky. */
  zhr: number
  speedKmS: number
  parent: string
  radiant: string
  bestTime: string
  note: string
}
