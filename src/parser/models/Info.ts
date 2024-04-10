import { has, toBool, isStr, extend } from '../../fn'
import { createBase } from './index'
import type { Object, JSONObject, ParserModel } from '../../types'

/**
 * Model for API field: info
 */
export default function createInfo(obj: JSONObject): ParserModel {
  obj.$meta.multilang = toBool(obj.$meta.multilang)
  const inject: Object = {
    $type: 'info',
    $meta: obj.meta,
    $interface: obj.interface ?? null,
    $val() {
      return this.$meta.slug
    },
    $has(prop: any): boolean {
      return isStr(prop) && has(this, prop)
    },
    $multilang(): boolean {
      return this.$meta.multilang
    },
    $languages(): ParserModel|null {
      return has(this.$meta, 'languages') ? this.$meta.languages : null
    },
  }
  return extend(createBase(), inject, obj.value ?? {}) as ParserModel
}