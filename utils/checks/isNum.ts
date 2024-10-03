import { isStr, toNum, isTrue } from '../'

/**
 * Check, if value is a number and optionally check interval.
 */
export default function isNum(
  val: any,
  min?: number|null,
  max?: number|null,
  strict?: boolean
): val is number {
  if (!isTrue(strict) && isStr(val) && /^-?\d+[,.]?\d*$/.test(val)) {
    val = toNum(val)
  }
  if (typeof val === 'number' && Number.isFinite(val)) {
    return (
      val >= (isNum(min) ? min : val) &&
      val <= (isNum(max) ? max : val)
    )
  }
  return false
}