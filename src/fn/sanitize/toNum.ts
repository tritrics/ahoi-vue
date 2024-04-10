import { isStr } from '../'

/**
 * Converts value to number.
 */
export default function toNum(val: any): number|null {
  if (isStr(val)) {
    val = val.replace(',', '.')
  }
  const res: number = parseFloat(val)
  return res ? res : null
}