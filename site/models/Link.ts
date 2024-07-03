import { toStr } from '../../fn'
import BaseModel from './Base'
import type { LinkTypes, ILinkModel } from './types'
import type { JSONObject } from '../../types'

export default class LinkModel extends BaseModel implements ILinkModel {
  type: 'link' = 'link'

  meta: {
    type: LinkTypes
    href: string
  }

  constructor(obj: JSONObject) {
    super(toStr(obj.meta?.title ?? obj.value))
    this.meta = {
      type: obj.meta.type as LinkTypes,
      href: obj.meta.href as string
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