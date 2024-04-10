import { isNum } from '../'

/**
 * Check, if a value is an array and optionally check the length.
 */
export default function isArr(val: any, min?: number,  max?: number): val is Array<any> {
  if (!val || !Array.isArray(val)) {
    return false
  } 
  return (
    val.length >= (isNum(min) ? min : val.length) &&
    val.length <= (isNum(max) ? max : val.length)
  )
}