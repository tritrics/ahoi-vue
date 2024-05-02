import { has } from '../../fn'
import BaseFieldsModel from './BaseFields'
import { createLinkByValues } from './Link'
import type { IObjectModel, ILinkModel } from './types'
import type { Object, JSONObject } from '../../types'

export default class ObjectModel extends BaseFieldsModel implements IObjectModel {
  type: 'object' = 'object'

  meta?: Object

  link?: ILinkModel

  constructor(obj: JSONObject) {
    super(obj)
    if (has(obj, 'meta')) {
      this.meta = obj.meta
      if (has(obj.meta, 'href')) {
        const type = obj.type === 'language' ? 'page' : obj.type
        this.link = createLinkByValues(type, obj.meta.title, obj.meta.href)
      }
    }
  }
  
  attr(asString: boolean = false): string|Object {
    if (this.link !== undefined) {
      return this.link.attr(asString)
    }
    return asString ? '' : {}
  }
}
