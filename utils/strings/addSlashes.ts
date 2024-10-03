import { toStr } from '../'

/**
 * Add slashes to critical characters.
 */
export default function addSlashes(val: string): string {
  return toStr(val).
    replace(/\\/g, '\\\\').
    replace(/u0008/g, '\\b').
    replace(/\t/g, '\\t').
    replace(/\n/g, '\\n').
    replace(/\f/g, '\\f').
    replace(/\r/g, '\\r').
    replace(/'/g, '\\\'').
    replace(/"/g, '\\"')
}