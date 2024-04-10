import { isArr, isTrue, unique, clone } from '../'

type Options = {
  empty: boolean,
  unique: boolean
}

/**
 * Sanitize an array (no nested arrays supported).
 * 
 * Options: 
 * {
 *   empty: remove empty values, default true
 *   unique: make array unique, default false
 * }
 */
export default function sanArr(val: any[], options: Options = { empty: true, unique: false }): any[] {
  if (!isArr(val)) {
    return val
  }
  let res: any[] = clone(val)
  if (isTrue(options.empty)) {
    res = res.filter(n => n)
  }
  if(isTrue(options.unique)) {
    res = unique(res)
  }
  return res
}