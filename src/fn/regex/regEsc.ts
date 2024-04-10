import { toStr } from '../'

/**
 * Escapes critical characters in a string for use as a regular expression.
 */
export default function regEsc(str: string): string {
  return toStr(str).replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}