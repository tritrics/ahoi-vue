import { has, each, extend, toBool } from '../../fn'
import { createBase, createLinkByValues } from './index'
import type { Object, JSONObject, ParserModel } from '../../types'

/**
 * Model for API field: page
 */
export default function createPage(obj: JSONObject): ParserModel {
  obj.meta.home = toBool(obj.meta.home)
  const inject: Object = {
    type: 'page',
    value: obj.meta.slug,
    meta: obj.meta,
    link: createLinkByValues('page', obj.meta.title, obj.meta.href),
    attr(asString: boolean = false, options: Object = {}): string|Object { // { router: false , attr: { class: 'link-class' } }
      return this.link.$attr(asString, options)
    },
  }
  const translations: Object = {}
  if (has(obj, 'translations')) { // if multilang
    translations.translations = {}
    each(obj.translations, (href: string, lang: string) => {
      translations.translations[lang] = createLinkByValues('page', lang, href)
    })
  }
  const fields: Object = {}
  if (has(obj, 'fields')) {
    fields.fields = obj.fields
  }
  return extend(createBase(), inject, translations, fields) as ParserModel
}