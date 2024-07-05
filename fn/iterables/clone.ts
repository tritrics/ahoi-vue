import { isArr, isObj } from '../index'
import type { Iterable } from '../../types'

/**
 * Clone an object or an array.
 */
export default function clone(val: Iterable): any {
  if (isArr(val)) {
    return val.slice(0)
  } else if (isObj(val)) {
    return Object.assign({}, val)
  }
  return val
}