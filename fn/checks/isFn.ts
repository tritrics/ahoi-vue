/**
 * Check, if value i a function.
 */
export default function isFn(val: any): val is Function {
  return val && (typeof val === 'function' || {}.toString.call(val) === '[object Function]')
}