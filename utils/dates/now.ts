/**
 * Get a Date object with date = today and time = now.
 * Optionally the date is taken from a given baseDate.
 */
export default function now(baseDate: Date | null = null): Date {
  const now: Date = new Date()
  const date: Date = baseDate instanceof Date ? baseDate : new Date() 
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), now.getHours(), now.getMinutes(), now.getSeconds(), 0)
}