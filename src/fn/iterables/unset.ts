import { isArr, isObj, isNum, has } from '../'
import type { Iterable } from '../../types'

/**
 * Unset/delete a node in an object or array.
 */
export default function unset(obj: Iterable, key: string | number): void {
  if (isArr(obj)) {
    if (isNum(key) && has(obj, key)) {
      obj.splice(key, 1)
    }
  } else if (isObj(obj)) {
    if (has(obj, key)) {
      delete obj[key]
    }
  }
}