import { toStr } from '../'

/**
 * Check, if value is a valid IP-v4-Address.
 */
export default function isIPv4(val: any): val is string {
  const blocks = toStr(val).split('.')
  if (blocks.length !== 4) {
    return false
  }
  for (const block of blocks) {
    const numericBlock = parseInt(block, 10);
    if (!(numericBlock >= 0 && numericBlock <= 255)) {
      return false
    }
  }
  return true
}