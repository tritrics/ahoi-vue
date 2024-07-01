import { has, toStr } from '../../fn'
import BaseModel from './Base'
import type { LinkTypes, ILinkModel } from './types'
import type { Object, JSONObject } from '../../types'

export default class LinkModel extends BaseModel implements ILinkModel {
  type: 'link' = 'link'

  meta: {
    type: LinkTypes
    href: string
  }

  attr: Object

  constructor(obj: JSONObject) {
    super(toStr(obj.meta?.title ?? obj.value))
    if (!obj.meta) {
      ahoi.log(obj)
    }
    this.meta = {
      type: obj.meta.type as LinkTypes,
      href: obj.meta.href as string
    }
    this.attr = obj.attr ?? {}
    if (has(this.meta, 'href') && !has(this.attr, 'href')) {
      this.attr.href = this.meta.href
    }
  }
}

export function createLinkByValues(type: LinkTypes, title: string, href: string): ILinkModel {
  return new LinkModel({
    value: title,
    meta: {
      type,
      href
    }
  }) as ILinkModel
}