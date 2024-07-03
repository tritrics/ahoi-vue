import { isStr } from '../'

/**
 * Converts value to integer.
 */
export default function toInt(val: any): number {
  if (isStr(val)) {
    val = val.replace(',', '.')
  }
  return parseInt(val, 10)
}