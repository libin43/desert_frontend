import type { SiteId } from '@/features/sites/types'

export interface Camp {
  id: string
  siteId: SiteId
  name: string
  format: string
  startsAt: string
  pricePerGuestAed: number
  maxGuests: number
  summary: string
  includes: string[]
}

export interface BookingRequest {
  campId: string
  nightKey: string
  guests: number
  name: string
  email: string
  phone: string
}

export interface BookingConfirmation {
  reference: string
  request: BookingRequest
  totalAed: number
}
