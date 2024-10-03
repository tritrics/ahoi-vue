import { each, isStr, isNum, toStr, addSlashes } from '../index'
import type { Object } from '../../types'

/**
 * Convert an object to htmlelement attributes. If value is not a string or number,
 * an empty attribute (only name) is added.
 */
export default function objToAttr(obj: Object): string {
  const res: string[] = []
  each(obj, (val: any, key: string) => {
    let attr: string
    if (isStr(val) || isNum(val)) {
      attr = `${key}="${addSlashes(toStr(val))}"`
    } else {
      attr = `${key}="${addSlashes(key)}"`
    }
    if (key === 'href' || key === 'to') {
      res.unshift(attr)
    } else {
      res.push(attr)
    }
  })
  return res.join(' ')
}