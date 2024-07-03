import { isStr, isNum, inArr, toStr } from '../'

/**
 * Check, if a value is true.
 * 
 * Values also accepted if strict === false:
 * 1, '1', 'true', 'TRUE'
 */
export default function isTrue(val: any, strict: boolean = true): val is true {
  if (val === true) {
    return true
  }
  if (!strict && (isStr(val) || isNum(val))) {
    return inArr(toStr(val).toLowerCase(), [ '1', 'true' ])
  }
  return false
}