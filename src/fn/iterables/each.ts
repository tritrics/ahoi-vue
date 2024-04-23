import { isArr, isObj } from '../'

/**
 * Loops an object or array and calls the callback function on each entry.
 * Callback parameters: (value, key, obj)
 */
export default function each(iterable: any, iteratee: Function): void {
  if (isArr(iterable)) {
    iterable.forEach((value, key) => iteratee(value, key, iterable))
  } else if (isObj(iterable)) {
    Object.keys(iterable || {}).forEach((key) => iteratee(iterable[key], key, iterable))
  }
}