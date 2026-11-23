import type { Camp } from '../types'

/** Sample catalogue for the concept. Replace with an API-backed source. */
export const CAMPS: readonly Camp[] = [
  {
    id: 'qudra-telescope-night',
    siteId: 'al-qudra',
    name: 'Telescope Night',
    format: 'Evening, 4 hours',
    startsAt: '18:30',
    pricePerGuestAed: 295,
    maxGuests: 12,
    summary:
      'A guided tour of the naked-eye sky, then planets, double stars and the moon through 10-inch Dobsonian telescopes.',
    includes: [
      'Astronomer guide',
      'Three 10-inch telescopes',
      'Karak and dates',
      'Ground mats and blankets',
    ],
  },
  {
    id: 'jais-summit-camp',
    siteId: 'jebel-jais',
    name: 'Summit Sky Camp',
    format: 'Overnight, one night',
    startsAt: '16:00',
    pricePerGuestAed: 690,
    maxGuests: 10,
    summary:
      'Camp on the ridge with an astrophotography coach. Shoot the Milky Way on a tripod, then sleep through the cold part.',
    includes: [
      'Tent and sleeping bag',
      'Astrophotography coaching',
      'Dinner and breakfast',
      'Hot drinks all night',
    ],
  },
  {
    id: 'liwa-empty-quarter',
    siteId: 'liwa',
    name: 'Empty Quarter Overnight',
    format: 'Overnight, one night',
    startsAt: '15:30',
    pricePerGuestAed: 1150,
    maxGuests: 8,
    summary:
      'A 4x4 transfer into the dunes, dinner under the stars and a guided night of the darkest sky the UAE has to offer.',
    includes: [
      '4x4 dune transfer',
      'Dune camp tent',
      'Dinner and breakfast',
      'Naked-eye and binocular tour',
    ],
  },
]

export const campForSite = (siteId: string) => CAMPS.find((c) => c.siteId === siteId) ?? CAMPS[0]!
