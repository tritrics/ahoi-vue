import { type Object } from '../../types'

/**
 * Check, if value is of type object (strict) or type argument.
 */
export default function isObj(val: any): val is Object {
  return /^\[object (object|arguments|module)\]$/.test(Object.prototype.toString.call(val).toLowerCase())
}