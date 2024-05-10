import { toStr } from '../../fn'
import BaseModel from './Base'
import type { LinkTypes, ILinkModel } from './types'
import type { JSONObject } from '../../types'

export default class LinkModel extends BaseModel implements ILinkModel {
  type: 'link' = 'link'

  attr: {
    type: string
    href: string
  }

  constructor(obj: JSONObject) {
    super(toStr(obj.meta?.title ?? obj.value))
    this.attr = obj.type === 'site' ? obj.home : obj.link ?? obj.attr
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