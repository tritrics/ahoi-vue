import { isIPv4, isIPv6 } from '../'

/**
 * Check, if value is a valid IP-Address.
 */
export default function isIP(val: any): val is string {
  return isIPv4(val) || isIPv6(val)
}