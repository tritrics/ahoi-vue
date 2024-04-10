import { toStr, isInt } from '../'

/**
 * Cuts the string to the given length and adds ... to the end.
 */
export default function truncate(val: string, length: number, replace: string = '...'): string {
  let res = toStr(val)
  if (isInt(length, 1) && res.length > length) {
    const add: string = toStr(replace)
    res = `${res.slice(0, (length - add.length))}${add}`
  }
  return res
}