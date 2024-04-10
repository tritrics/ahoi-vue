import { each, isStr, isNum, toStr, addSlashes } from '../index'
import type { Object } from '../../types'

/**
 * Convert an object to htmlelement attributes. If value is not a string or number,
 * an empty attribute (only name) is added.
 */
export default function objToAttr(obj: Object): string {
  const start: string[] = []
  const end: string[] = []
  each(obj, (val: any, key: string) => {
    if (isStr(val) || isNum(val)) {
      const attr = `${key}="${addSlashes(toStr(val))}"`
      if (key === 'href' || key === 'to') {
        start.unshift(attr)
      } else {
        start.push(attr)
      }
    } else {
      end.push(key)
    }
  })
  return start.concat(end).join(' ')
}