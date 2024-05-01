import { has } from '../../fn'
import BaseModel from './Base'
import { parseModelsRec } from '../index'
import LinkModel, { createLinkByValues } from './Link'
import type { IObjectModel } from '../types'
import type { Object, JSONObject } from '../../types'

export default class ObjectModel extends BaseModel implements IObjectModel {
  meta?: Object

  link?: LinkModel

  fields?: Object

  constructor(obj: JSONObject) {
    super(undefined)
    if (has(obj, 'meta')) {
      this.meta = obj.meta
      if (has(obj.meta, 'href')) {
        const type = obj.type === 'language' ? 'page' : obj.type
        this.link = createLinkByValues(type, obj.meta.title, obj.meta.href)
      }
    }
    if (has(obj, 'fields')) {
      this.fields = parseModelsRec(obj.fields)
    }
  }

  has(field: string): boolean {
    return this.fields !== undefined && has(this.fields, field)
  }
  
  attr(asString: boolean = false): string|Object { // { router: false , attr: { class: 'link-class' } }
    if (this.link !== undefined) {
      return this.link.attr(asString)
    }
    return asString ? '' : {}
  }
}
