import { has, extend } from '../../fn'
import { createBase, createString } from './index'
import type { Object, JSONObject, ParserModel } from '../../types'

/**
 * Model for API field: option
 */
export default function createOption(obj: JSONObject): ParserModel {
  const inject: Object = {
    $type: 'option',
    $value: obj.value,
    $label: has(obj, 'label') ? createString(obj.label) : null
  }
  return extend(createBase(), inject) as ParserModel
}
