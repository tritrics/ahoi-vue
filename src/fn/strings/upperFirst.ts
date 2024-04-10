import { toStr } from '../'

/**
 * Converts first character of a string to uppercase and the rest to lower.
 */
export default function upperFirst(val: string): string {
  const str: string = toStr(val)
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}