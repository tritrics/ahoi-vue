import { toStr } from '../'

/**
 * Remove \n, \r
 */
export default function rmNewlines(val: string): string {
  return toStr(val).replace(/\s+/gm, ' ').trim()
}