import { isObj, isArr } from '../'
import type { Iterable } from '../../types'

/**
 * Get the keys from an object or array.
 */
export default function keys(obj: Iterable): (string|number)[] {
  if (isArr(obj)) {
    return Array.from(obj.keys())
  } else if (isObj(obj)) {
    return Object.keys(obj ?? {})
  } 
  return []
}