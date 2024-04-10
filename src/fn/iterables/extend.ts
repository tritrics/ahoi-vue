import { isArr, each, isEmpty, isObj, isIterable } from '../'
import type { Iterable } from '../../types'

/**
 * Extend an object or an array by multiple others.
 * The first is the base object and returned.
 */
export default function extend<T>(base: T, ...obj: Iterable[]): T {
  const extend: any[] = []
  each(obj, (mixed: any) => {
    if (isIterable(mixed)) {
      extend.push(mixed)
    } else if (!isEmpty(mixed)) {
      extend.push([ mixed ])
    }
  })
  if (isArr(base)) {
    return base.concat(...extend) as T
  } else if (isObj(base)) {
    return Object.assign(base, ...extend)
  }
  return base
}