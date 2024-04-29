import { isObj, toBool, extend, has, each } from '../fn'
import { createLinkByValues } from './models/index'
import type { ResponseModel } from './types'
import type { Object, JSONObject } from '../types'

export default function createResponse(type: string, body: JSONObject, data?: Object): ResponseModel {
  const base: Object = {
    type,
    meta: body.meta,
  }

  const collection: Object = {}
  if (has(body, 'collection')) {
    collection.collection = body.collection
  }

  const interf: Object = {}
  if (has(body, 'interface')) {
    interf.interface = body.interface
  }

  const translations: Object = {}
  if (has(body, 'translations')) {
    translations.translations = {}
    each(body.translations, (href: string, lang: string) => {
      translations.translations[lang] = createLinkByValues('page', lang, href)
    })
  }

  const content: Object = {}
  if(isObj(data)) {
    if (type === 'info') {
      content.languages = data
    } else if (type === 'language') {
      content.terms = data
    } else {
      content[type] = data
    }
    
  }

  return extend(
    base,
    collection,
    interf,
    translations,
    content
  ) as ResponseModel
}
