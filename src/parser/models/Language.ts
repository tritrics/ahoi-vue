import { toBool, extend } from '../../fn'
import { createBase, createLink } from './index'
import type { Object, JSONObject, ParserModel } from '../../types'

/**
 * Model for API field: language
 */
export default function createLanguage(obj: JSONObject): ParserModel {
  obj.meta.default = toBool(obj.meta.default)
  const inject: Object = {
    $type: 'language',
    $value: obj.value,
    $meta: obj.meta,
    $link: createLink(obj),
    $terms: obj.terms ?? null,
    $isDefault() {
      return this.$meta.default
    },
    $code() {
      return this.$meta.code
    },
    $locale() {
      return this.$meta.locale
    },
    $direction() {
      return this.$meta.direction
    },
    $tag(options: Object = {}) {
      return this.$link.$tag(options)
    },
    $attr(asString: boolean = false, options: Object = {}) { // { router: false , attr: { class: 'link-class' } }
      return this.$link.$attr(asString, options)
    },
  }
  return extend(createBase(), inject) as ParserModel
}