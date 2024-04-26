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
  }
  const label: Object = {}
  if (has(obj, 'label')) {
    label.$label = createString(obj.label)
  }
  return extend(createBase(), inject, label) as ParserModel
}
