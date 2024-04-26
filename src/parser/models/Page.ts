import { has, each, isStr, extend, toBool } from '../../fn'
import { createBase, createLinkByValues } from './index'
import type { Object, JSONObject, ParserModel } from '../../types'

/**
 * Model for API field: page
 */
export default function createPage(obj: JSONObject): ParserModel {
  obj.meta.home = toBool(obj.meta.home)
  const inject: Object = {
    $type: 'page',
    $meta: obj.meta,
    $link: createLinkByValues('page', obj.meta.title, obj.meta.href),
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

  // add optional translations
  const translations: Object = {}
  if (has(obj, 'translations')) {
    translations.$translations = {}
    each(obj.translations, (href: string, lang: string) => {
      translations.$translations[lang] = createLinkByValues('page', lang, href)
    })
  }

  return extend(createBase(), inject, translations, obj.value ?? {}) as ParserModel
}