import { isArr, clone } from '../'

/**
 * Check if one or more values exist in array.
 * needle can be single value or array of values.
 */
export default function inArr(needle: any|any[], haystack: any[]): boolean {
  if (!isArr(haystack)) {
    return false
  }
  if (isArr(needle)) {
    return clone(needle).filter((n: any) => !haystack.includes(n)).length === 0
  }
  return haystack.includes(needle)
}