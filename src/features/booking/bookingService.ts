import type { BookingConfirmation, BookingRequest, Camp } from './types'

/**
 * Stand-in for a booking API. It resolves after a short delay with a generated
 * reference so the UI flow is real; swap the body for a `fetch` to your backend.
 */
export async function submitBooking(
  request: BookingRequest,
  camp: Camp,
): Promise<BookingConfirmation> {
  await new Promise((resolve) => setTimeout(resolve, 900))
  const reference = `DO-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
  return { reference, request, totalAed: camp.pricePerGuestAed * request.guests }
}
