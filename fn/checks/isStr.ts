import { isNum } from '../'

/**
 * Check, if value is a string and optionally check for length.
 */
export default function isStr(
  val: any,
  min?: number|null,
  max?: number|null,
  allowLinebreaks: boolean = true
): val is string {
  if (typeof val !== 'string') {
    return false
  }
  if (!allowLinebreaks && /\r|\n/.exec(val)) {
    return false
  }
  return (
    val.length >= (isNum(min) ? min : val.length) &&
    val.length <= (isNum(max) ? max : val.length)
  )
}