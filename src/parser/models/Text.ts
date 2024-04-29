import { extend, isObj, has } from '../../fn'
import { getOption } from '../index'
import { createBase } from './index'
import type { Object, JSONObject, ParserModel } from '../../types'

/**
 * Model for API field: text
 */
export default function createText(obj: JSONObject): ParserModel {
  const inject: Object = {
    type: 'text',
    value: (isObj(obj) && has(obj, 'value')) ? obj.value : obj,
    str(options: Object = {}): string {
      let str: string = this.value
      if(getOption('text', 'nl2br', options)) {
        str = str.replace(/\n/mg, '<br />')
      }
      return str
    },
  }
  return extend(createBase(), inject) as ParserModel
}
