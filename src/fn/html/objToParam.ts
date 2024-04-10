import { each, count, isStr, isNum, isArr } from '../'
import type { Object } from '../../types'

/**
 * Converts an object to GET params.
 */
export default function objToParams(obj: Object): string {
  const res: string[] = []
  each (obj, (val: any, key: string) => {
    if (isStr(val) || isNum(val)) {
      res.push(`${key}=${encodeURIComponent(val)}`)
    } else if (isArr(val)) {
      each (val, (entry: any) => {
        if (isStr(val) || isNum(val)) {
          res.push(`${key}[]=${encodeURIComponent(entry)}`)
        }
      })
    }
  })
  return count(res) ? `?${res.join('&')}` : ''
}