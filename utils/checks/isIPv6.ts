import { toStr } from '../'

/**
 * Check, if value is a valid IP-v6-Address.
 */
export default function isIPv6(val: any): val is string {
  const blocks = toStr(val).split(':')
  if (blocks.length < 8) {
    return false
  }
  for (const block of blocks) {
    if (!/^[0-9A-Fa-f]{1,4}$/.test(block)) {
       return false;
    }
  }
  return true
}