/**
 * Converts value to string.
 */
export default function toStr(val: any): string {
  return typeof val === 'object' ? '' : `${val}`
}