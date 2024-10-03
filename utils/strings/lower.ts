import { toStr } from '../'

/**
 * Converts string to loser case.
 */
export default function lower(val: string): string {
  return toStr(val).toLowerCase()
}