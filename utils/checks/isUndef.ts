/**
 * Check, if value is undefined.
 */
export default function isUndef(val: any): val is undefined {
  return typeof val === 'undefined'
}