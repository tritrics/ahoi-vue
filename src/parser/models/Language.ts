import { toBool, extend } from '../../fn'
import { createBase, createLinkByValues } from './index'
import type { Object, JSONObject, ParserModel } from '../../types'

/**
 * Model for API field: language
 */
export default function createLanguage(obj: JSONObject): ParserModel {
  obj.meta.default = toBool(obj.meta.default)
  const inject: Object = {
    type: 'language',
    meta: obj.meta,
    link: createLinkByValues('page', obj.meta.title, obj.meta.href),
    attr(asString: boolean = false, options: Object = {}) { // { router: false , attr: { class: 'link-class' } }
      return this.link.attr(asString, options)
    },
  }
  return extend(createBase(), inject) as ParserModel
}