import { extend } from '../../fn'
import { createBase } from './index'
import type { Object, JSONObject, ParserModel } from '../../types'

/**
 * Model for API field: user
 */
export default function createUser(obj: JSONObject): ParserModel {
  const inject: Object = {
    type: 'user',
    value: obj.meta.id,
    meta: obj.meta,
  }
  return extend(createBase(), inject, obj.value ?? {}) as ParserModel
}