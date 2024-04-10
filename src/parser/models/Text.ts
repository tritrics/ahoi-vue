import { extend } from '../../fn'
import { getOption } from '../index'
import { createString } from './index'
import type { Object, JSONObject, ParserModel } from '../../types'

/**
 * Model for API field: text
 */
export default function createText(obj: JSONObject): ParserModel {
  const inject: Object = {
    $type: 'text',
    $str(options: Object = {}): string {
      let str: string = this.$val()
      if(getOption('text.nl2br', options)) {
        str = str.replace(/\n/mg, '<br />')
      }
      return str
    },
  }
  return extend(createString(obj), inject) as ParserModel
}
