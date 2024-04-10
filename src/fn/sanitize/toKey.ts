import { trim, lower, toStr } from '../'

/**
 * Converts value to normalized string for use as keys or standardized values.
 */
export default function toKey(val: any): string {
  return trim(lower(toStr(val)))
}