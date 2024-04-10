import { has, isStr, extend } from '../../fn'
import { createBase, createLink } from './index'
import type { Object, JSONObject, ParserModel } from '../../types'

/**
 * Model for API field: site
 */
export default function createSite(obj: JSONObject): ParserModel {
  const inject: Object = {
    $type: 'site',
    $meta: obj.meta,
    $home: createLink(obj),
    $val(): string {
      return this.$meta.host
    },
    $has(prop: any): boolean {
      return isStr(prop) && has(this, prop)
    },
  }
  return extend(createBase(), inject, obj.value ?? {}) as ParserModel
}