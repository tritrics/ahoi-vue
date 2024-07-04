import { get } from "../"
import type { Iterable } from "../types"

/**
 * Check, if an object or array has a given key(s).
 */
export default function has(obj: Iterable, ...keys: (string|number|(string|number)[])[]): boolean {
  return get(obj, ...keys) !== undefined
}