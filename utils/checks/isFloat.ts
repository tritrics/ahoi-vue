import { isNum, isStr, isTrue, toNum } from '../'

/**
 * Check, if value is a float number and optionally check interval.
 */
export default function isFloat(
  val: any,
  min?: number|null,
  max?: number|null,
  strict?: boolean
): val is number {
  if (!isTrue(strict) && isStr(val) && /^-?\d+\.?\d*$/.test(val)) {
    val = toNum(val)
  }
  return isNum(val, min, max, true) && Math.floor(val) !== val
}