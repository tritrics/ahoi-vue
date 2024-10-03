import { toStr } from '../'

/**
 * Strip \ from string.
 */
export default function stripslashes(val: string): string {
  return toStr(val).replace(/\\(.)/mg, '$1')
}