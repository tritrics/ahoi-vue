import { has, isStr, extend } from '../../fn'
import { createBase, createLinkByValues } from './index'
import type { Object, JSONObject, ParserModel } from '../../types'

/**
 * Model for API field: file
 */
export default function createFile(obj: JSONObject): ParserModel {
  const inject: Object = {
    type: 'file',
    value: obj.meta.filename,
    meta: obj.meta,
    link: createLinkByValues('file', obj.meta.title, obj.meta.href),
    has(prop: any): boolean {
      return isStr(prop) && has(this, prop)
    },
    attr(asString: boolean = false, options: Object = {}): string|Object { // { router: false , attr: { class: 'link-class' } }
      return this.link.attr(asString, options)
    },
  }
  const fields: Object = {}
  if (has(obj, 'fields')) {
    fields.fields = obj.fields
  }
  return extend(createBase(), inject, fields) as ParserModel
}
