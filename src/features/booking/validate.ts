export interface BookingFields {
  name: string
  email: string
  phone: string
}

export type BookingErrors = Partial<Record<keyof BookingFields, string>>

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE = /^[+\d][\d\s()-]{6,}$/

export function validateBooking({ name, email, phone }: BookingFields): BookingErrors {
  const errors: BookingErrors = {}
  if (name.trim().length < 2) errors.name = 'Enter the name for the booking.'
  if (!EMAIL.test(email.trim())) errors.email = 'Enter an email like name@example.com.'
  if (phone.trim() && !PHONE.test(phone.trim()))
    errors.phone = 'Enter digits only, with an optional + at the start.'
  return errors
}
