import { each, htmlentities, toStr } from '../../fn'
import BaseModel from './Base'
import type { LinkTypes, ILinkModel } from '../types'
import type { JSONObject } from '../../types'

/**
 * Model representing a link field (url, page, file, mail, tel, anchor, custom).
 */
export default class LinkModel extends BaseModel implements ILinkModel {
  
  /**
   * Type
   */
  type: 'link' = 'link'

  /**
   * The link-meta for html element generation
   */
  meta: {
    type: LinkTypes
    href: string
  }

  /** */
  constructor(obj: JSONObject) {
    super(toStr(obj.meta?.title ?? obj.value))
    this.meta = {
      type: obj.meta.type as LinkTypes,
      href: obj.meta.href as string
    }
  }

  /**
   * Getter for value as string
   */
  str(): string {
    return `<a href="${this.meta.href}" data-type="${this.meta.type}">${toStr(this.value)}</a>`
  }
}

/**
 * Helper function to create a link model from values
 */
export function createLinkByValues(type: LinkTypes, title: string, href: string): ILinkModel {
  return new LinkModel({
    value: title,
    meta: {
      type,
      href
    }
  }) as ILinkModel
}