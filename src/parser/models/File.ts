import { has, isStr, extend } from '../../fn'
import { createBase, createLink } from './index'
import type { Object, JSONObject, ParserModel } from '../../types'

/**
 * Model for API field: file
 */
export default function createFile(obj: JSONObject): ParserModel {
  const inject: Object = {
    $type: 'file',
    $meta: obj.meta,
    $link: createLink(obj),
    $val(): string {
      return this.$meta.filename
    },
    $has(prop: any): boolean {
      return isStr(prop) && has(this, prop)
    },
    $tag(options: Object = {}): string {
      return this.$link.$tag(options)
    },
    $attr(asString: boolean = false, options: Object = {}): string|Object { // { router: false , attr: { class: 'link-class' } }
      return this.$link.$attr(asString, options)
    },
  }
  return extend(createBase(), inject, obj.value ?? {}) as ParserModel
}
