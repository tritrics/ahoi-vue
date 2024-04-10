import { extend } from '../../fn'
import { createBase } from './index'
import type { Object, JSONObject, ParserModel } from '../../types'

/**
 * Model for API field: block
 */
export default function createBlock(obj: JSONObject): ParserModel {
  const inject: Object = {
    $type: 'block',
    $block: obj.block,
    $val(): string {
      return this.$meta.id
    },
  }
  return extend(createBase(), inject, obj.value ?? {}) as ParserModel
}