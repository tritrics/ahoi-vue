import { toStr, toBool, objToAttr } from '../../fn'
import BaseModel from './Base'
import type { LinkTypes, ILinkModel } from './types'
import type { Object, JSONObject } from '../../types'

export default class LinkModel extends BaseModel implements ILinkModel {
  type: 'link' = 'link'

  attributes: Object = {}

  constructor(obj: JSONObject) {
    super(toStr(obj.meta?.title ?? obj.value))
    this.attributes = obj.type === 'site' ? obj.home : obj.link ?? obj.attr
  }
  
  attr(asString: boolean = false): string|Object {
    const attr: Object = { ...(this.attributes || {}) }
    delete(attr.type)
    return toBool(asString) ? objToAttr(attr) : attr
  }
}

export function createLinkByValues(type: LinkTypes, title: string, href: string): ILinkModel {
  return new LinkModel({
    value: title,
    link: {
      type,
      href
    }
  }) as ILinkModel
}