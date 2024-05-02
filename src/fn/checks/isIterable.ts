import { isObj, isArr } from '../'
import type { Object } from '../types'

/**
 * Check, if value is iterable (object, array).
 */
export default function isIterable(val: any): val is Object|any[] {
  return isObj(val) || isArr(val)
}