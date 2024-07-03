import { isStr, isNum, inArr, toStr } from '../'

/**
 * Check, if a value is false.
 * 
 * Values also accepted if strict === false:
 * 0, '0', 'false', 'FALSE'
 */
export default function isFalse(val: any, strict: boolean = true): val is false {
  if (val === false) {
    return true
  }
  if (!strict && (isStr(val) || isNum(val))) {
    return inArr(toStr(val).toLowerCase(), [ '0', 'false' ])
  }
  return false
}