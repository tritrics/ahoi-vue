import { toStr } from '../'

/**
 * Converts string to upper case.
 */
export default function upper(val: string): string {
  return toStr(val).toUpperCase()
}