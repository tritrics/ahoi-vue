import { extend } from '../../fn'
import { createString } from './index'
import type { Object, JSONObject, ParserModel } from '../../types'

/**
 * Model for API field: markdown
 */
export default function createMarkdown(obj: JSONObject): ParserModel {
  const inject: Object = {
    $type: 'markdown',
    $html() {
      return 'mardown converting to html is not implemented yet'
    },
  }
  return extend(createString(obj), inject) as ParserModel
}