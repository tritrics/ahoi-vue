import { extend } from '../../fn'
import { createBase } from './index'
import type { Object, JSONObject, ParserModel } from '../../types'

/**
 * Model for API field: block
 */
export default function createBlock(obj: JSONObject): ParserModel {
  const inject: Object = {
    type: 'block',
    value: obj.block,
    block: obj.block,
  }
  return extend(createBase(), inject, obj.value ?? {}) as ParserModel
}