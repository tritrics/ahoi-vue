import { isTrue, isFalse } from '../'

/**
 * Check, if a value is boolean.
 * 
 * Values also accepted if strict === false:
 * 0, '0', 'false', 'FALSE', 1, '1', 'true', 'TRUE'
 */
export default function isBool(
  val: any,
  strict: boolean = true
): val is boolean {
  return isTrue(val, strict) || isFalse(val, strict)
}