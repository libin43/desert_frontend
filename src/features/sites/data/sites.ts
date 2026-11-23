import type { Site, SiteId } from '../types'

export const SITES: readonly Site[] = [
  {
    id: 'al-qudra',
    name: 'Al Qudra',
    emirate: 'Dubai',
    lat: 24.85,
    lng: 55.37,
    bortle: 4,
    elevationM: 90,
    distanceFromDubaiKm: 45,
    driveFromDubai: '45 min',
    tagline: 'The closest real dark. An evening trip, not an expedition.',
    description:
      "Flat desert and salt-flat horizons south of Dubai's glow. The city still stains the north, but turn south and the Milky Way's core is there on a moonless summer night.",
    highlights: [
      'Planets and the moon through a telescope',
      'Milky Way core, May to August',
      'Easy to reach after work',
    ],
    bestFor: 'First-timers and weeknights',
    cloudBaseline: 16,
  },
  {
    id: 'jebel-jais',
    name: 'Jebel Jais',
    emirate: 'Ras Al Khaimah',
    lat: 25.95,
    lng: 56.13,
    bortle: 3,
    elevationM: 1600,
    distanceFromDubaiKm: 120,
    driveFromDubai: '1 h 45 min',
    tagline: 'Above the haze. Cold air, steady stars.',
    description:
      'At 1,600 metres you sit above the dust and humidity that soften the sky at sea level, so stars hold still. Winter nights drop near freezing, and cloud can roll in over the ridge.',
    highlights: [
      'Steadier, sharper views above the haze',
      'Winter Milky Way and Orion',
      'Cool nights in summer',
    ],
    bestFor: 'Astrophotography and summer escapes',
    cloudBaseline: 26,
  },
  {
    id: 'liwa',
    name: 'Liwa',
    emirate: 'Abu Dhabi',
    lat: 23.13,
    lng: 53.77,
    bortle: 2,
    elevationM: 120,
    distanceFromDubaiKm: 330,
    driveFromDubai: '3 h 30 min',
    tagline: 'The edge of the Empty Quarter. The darkest sky in the country.',
    description:
      'Giant dunes and hundreds of kilometres of nothing in every direction. On a new-moon night the Milky Way casts a faint shadow and the zodiacal light stands up from the horizon.',
    highlights: [
      'Faint shadows from the Milky Way',
      'Zodiacal light before dawn and after dusk',
      'Dune camps with no light at all',
    ],
    bestFor: 'A full night, new moon, no compromises',
    cloudBaseline: 11,
  },
]

export const DEFAULT_SITE_ID: SiteId = 'al-qudra'

export const getSite = (id: SiteId): Site => SITES.find((s) => s.id === id) ?? SITES[0]!

export const DUBAI = { name: 'Dubai', lat: 25.25, lng: 55.3, bortle: 9 } as const
