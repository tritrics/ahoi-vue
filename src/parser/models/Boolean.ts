import { toBool, extend } from '../../fn'
import { createBase } from './index'
import type { Object, JSONObject, ParserModel } from '../../types'

/**
 * Model for API field: boolean
 */
export default function createBoolean(obj: JSONObject): ParserModel {
  const inject: Object = {
    $type: 'boolean',
    $value: toBool(obj.value),
    $is(prop: any): boolean {
      return this.$value === toBool(prop)
    },
    $isTrue(): boolean {
      return this.$value === true
    },
    $isFalse(): boolean {
      return this.$value === false
    },
  }
  return extend(createBase(), inject) as ParserModel
}
