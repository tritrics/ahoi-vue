import { isIterable } from "../"
import type { Iterable } from "../types"

/**
 * Check, if an object or array has a given key(s).
 */
export default function has(obj: Iterable, ...keys: (string|number)[]): boolean {
  if (!isIterable(obj)) {
    return false
  }
  return keys.reduce(
    (node: any, key: string|number) => {
      return (node && node[key] !== 'undefined') ? node[key] : undefined
    }, obj) !== undefined
}