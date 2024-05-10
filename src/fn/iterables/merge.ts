import { isIterable, isArr, isObj, clone, unique, each } from '../'
import type { Object, Iterable } from '../../types'

/**
 * Helper to merge arrays. (First element must be of type array.)
 */
function mergeArrays(elems: any[], mergeOptions: Object): Array<any>{
  let res: Array<any> = []
  elems = elems.map((elem) => {
    return isArr(elem) ? elem : [ elem ]
  })
  each(elems, (elem: any[]) => {
    res = [ ...res, ...elem ]
  })
  if (mergeOptions.unique) {
    res = unique(res)
  }
  return res
}

/**
 * Helper to merge objects. (First element must be of type object.)
 */
function mergeObjects(elems: any[], mergeOptions: Object): Object {
  const res: Object = {}
  elems = elems.filter((obj: any) => {
    return isObj(obj) ? obj : false
  })
  each(elems, (obj: Object) => {
    for (const key of Object.keys(obj)) {
      if (isObj(res[key]) && isObj(obj[key])) {
        res[key] = mergeObjects([res[key], obj[key]], mergeOptions)
        continue
      }
      if (isArr(res[key]) && isArr(obj[key]) && mergeOptions.arrays) {
        res[key] = mergeArrays([res[key], obj[key]], mergeOptions)
        continue
      }
      res[key] = isIterable(obj[key]) ? clone(obj[key]) : obj[key]
    }
  })
  return res
}

/**
 * Method to deep merge multiple objects or arrays where arrays as values are
 * also handled. Result is returned as a new object/array. Use like
 * 
 * const result = merge(obj1, obj2[, obj3])
 */
export default function merge(...args: any[]): Iterable|null {
  if (!args.length) {
    return null
  }
  // first element determines if array of objects are merged  
  if (isArr(args[0])) {
    return mergeArrays(args, { arrays: true, unique: true })
  } else if (isObj(args[0])) {
    return mergeObjects(args, { arrays: true, unique: true })
  }
  return null
}