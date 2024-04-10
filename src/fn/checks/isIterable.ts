import { isObj, isArr } from '../'

/**
 * Check, if value is iterable (object, array).
 */
export default function isIterable(val: any): val is object|any[] {
  return isObj(val) || isArr(val)
}