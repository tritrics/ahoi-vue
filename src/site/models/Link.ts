import { has, unset, count, toStr } from '../../fn'
import BaseModel from './Base'
import type { LinkTypes, ILinkModel } from './types'
import type { Object, JSONObject } from '../../types'

export default class LinkModel extends BaseModel implements ILinkModel {
  type: 'link' = 'link'

  attr?: {
    type: string
    href: string
  }

  meta?: Object

  constructor(obj: JSONObject) {
    super(toStr(obj.meta?.title ?? obj.value))
    if (has(obj, 'meta')) {
      this.attr = {
        type: obj.meta.type as string,
        href: obj.meta.href as string
      }
      unset(obj.meta, 'type')
      unset(obj.meta, 'href')
      if (count(obj.meta)) {
        this.meta = obj.meta
      }
    } else if (has(obj, 'attr')) {
      this.attr = obj.attr
    }
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