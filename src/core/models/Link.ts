import { toStr, toBool, objToAttr } from '../../fn'
import BaseModel from './Base'
import type { LinkTypes } from '../types'
import type { ModelTypes, ILinkModel } from '../types'
import type { Object, JSONObject } from '../../types'

export default class LinkModel extends BaseModel implements ILinkModel {
  _type: ModelTypes = 'link'

  _attributes: Object = {}

  constructor(obj: JSONObject) {
    super(toStr(obj.meta?.title ?? obj.value))
    this._attributes = obj.type === 'site' ? obj.home : obj.link ?? obj.attr
  }

  get attributes(): Object {
    return this._attributes
  }
  
  attr(asString: boolean = false): string|Object {
    const attr: Object = { ...(this.attributes || {}) }
    delete(attr.type)
    return toBool(asString) ? objToAttr(attr) : attr
  }
}

export function createLinkByValues(type: LinkTypes, title: string, href: string): LinkModel {
  return new LinkModel({
    value: title,
    link: {
      type,
      href
    }
  })
}