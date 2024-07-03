import { toDate, isStr } from '../'

/**
 * Check, if value is a Date instance and optionally check period.
 */
export default function isDate(
  val: any,
  min?: Date|null,
  max?: Date|null,
  strict: boolean = true,
  format: string = 'yyyy-mm-dd'
): val is Date {
  if (!strict && isStr(val)) {
    val = toDate(val, format)
  }
  if (val instanceof Date) {
    return (
      val >= (min instanceof Date ? min : val) &&
      val <= (max instanceof Date ? max : val)
    )
  }
  return false
}