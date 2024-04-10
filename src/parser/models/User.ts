import { extend } from '../../fn'
import { createBase } from './index'
import type { Object, JSONObject, ParserModel } from '../../types'

/**
 * Model for API field: user
 */
export default function createUser(obj: JSONObject): ParserModel {
  const inject: Object = {
    $type: 'user',
    $meta: obj.meta,
    $val(): string {
      return this.$meta.id
    },
  }
  return extend(createBase(), inject, obj.value ?? {}) as ParserModel
}