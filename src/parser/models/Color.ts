import { extend, toBool } from '../../fn'
import { createBase } from './index'
import type { Object, JSONObject, ParserModel } from '../../types'

/**
 * Model for API field: color
 */
export default function createColor(obj: JSONObject): ParserModel {
  const inject: Object = {
    type: 'color',
    value: obj.value,
    format: obj.format,
    alpha: obj.alpha
  }
  return extend(createBase(), inject) as ParserModel
}
