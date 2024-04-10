import { isStr } from '../'

/**
 * Converts value to float.
 */
export default function toFloat(val: any): number {
  if (isStr(val)) {
    val = val.replace(',', '.')
  }
  return parseFloat(val)
}