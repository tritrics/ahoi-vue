import { toBool, extend } from '../../fn'
import { createBase, createLinkByValues } from './index'
import type { Object, JSONObject, ParserModel } from '../../types'

/**
 * Model for API field: language
 */
export default function createLanguage(obj: JSONObject): ParserModel {
  obj.meta.default = toBool(obj.meta.default)
  const inject: Object = {
    $type: 'language',
    $value: obj.meta.title,
    $meta: obj.meta,
    $link: createLinkByValues('page', obj.meta.title, obj.meta.href),
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
    $attr(asString: boolean = false, options: Object = {}) { // { router: false , attr: { class: 'link-class' } }
      return this.$link.$attr(asString, options)
    },
  }
  return extend(createBase(), inject, obj.value ?? {}) as ParserModel
}