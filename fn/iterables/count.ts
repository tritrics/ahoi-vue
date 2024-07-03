import { isObj, isArr, isStr, isNum, toStr } from '../'
import type { Iterable } from '../../types'

/**
 * Get entries/length of data types array, object, string, number.
 */
export default function count(val: Iterable|string|number): number {
  if (isArr(val) || isStr(val)) {
    return val.length
  } else if (isObj(val)) {
    return Object.keys(val).length
  } else if (isNum(val)) {
    return toStr(val).length
  }
  return 0
}