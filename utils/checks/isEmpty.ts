import { isNull, isUndef, isArr } from '../'

/**
 * Check, if a value is an empty array, empty string, null or undefined.
 */
export default function isEmpty(val: any): boolean {
  if (isArr(val)) {
    return val.length === 0
  }
  return val === '' || isNull(val) || isUndef(val)
}