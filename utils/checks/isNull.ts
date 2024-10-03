import { isStr } from '../'

/**
 * Check, if value is null.
 * 
 * Values also accepted if strict === false:
 * 'null', 'NULL'
 */
export default function isNull(val: any, strict: boolean = true): val is null {
  if(val === null) {
    return true
  }
  if (!strict && isStr(val)) {
    return val.toLowerCase() === 'null'
  }
  return false
}