import { isIterable, isStr } from '..'
import type { Iterable } from '../../types'

/**
 * Get a subnode from a nested object by giving the keys as a dot-separated string or array.
 * get(obj, 'foo.bar', 'foo', ['foo', 'bar'])
 */
export default function get(obj: Iterable, ...keys: (string|number|(string|number)[])[]): any {
  if (isIterable(obj)) {
    const nodes = keys
      .flat()
      .map((val: any) => isStr(val) ? val.split('.') : val)
      .flat()
    return nodes.reduce((next: any, key: string|number) => {
      return next !== undefined ? next[key] : undefined
    }, obj)
  }
}