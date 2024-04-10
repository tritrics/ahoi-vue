import { has, each, isStr, extend, toBool } from '../../fn'
import { createBase, createLink } from './index'
import type { Object, JSONObject, ParserModel } from '../../types'

/**
 * Model for API field: page
 */
export default function createPage(obj: JSONObject): ParserModel {
  obj.meta.home = toBool(obj.meta.home)
  const translations: Object = {}
  if (has(obj, 'translations')) {
    each(obj.translations, (link: Object, lang: string) => {
      translations[lang] = createLink(link)
    })
  }
  const inject: Object = {
    $type: 'page',
    $meta: obj.meta,
    $link: createLink(obj),
    $translations: translations,
    $val() {
      return this.$meta.slug
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