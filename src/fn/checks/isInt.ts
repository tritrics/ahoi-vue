import { isNum, isStr, isTrue, toNum } from '../'

/**
 * Check, if value is an integer number and optionally check interval.
 */
export default function isInt(
  val: any,
  min?: number|null,
  max?: number|null,
  strict?: boolean
): val is number {
  if (!isTrue(strict) && isStr(val) && /^-?\d+$/.test(val)) {
    val = toNum(val)
  }
  return isNum(val, min, max) && Math.floor(val) === val
}