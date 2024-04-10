import { extend, toBool } from '../../fn'
import { createBase } from './index'
import type { Object, JSONObject, ParserModel } from '../../types'

/**
 * Model for API field: color
 */
export default function createColor(obj: JSONObject): ParserModel {
  const inject: Object = {
    $type: 'color',
    $format: obj.meta.format,
    $alpha: toBool(obj.meta.alpha),
    $value: obj.value,
  }
  return extend(createBase(), inject) as ParserModel
}
