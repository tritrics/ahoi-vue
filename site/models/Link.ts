import { each, trim, toStr } from '../../fn'
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
  attr: {
    'data-type': LinkTypes
    href: string
  }

  /** */
  constructor(obj: JSONObject) {
    super(toStr(obj.meta?.title ?? obj.value))
    this.attr = {
      'data-type': obj.meta.type as LinkTypes,
      href: obj.meta.href as string
    }
  }

  /**
   * Get attributes as a string to be used in html-element
   */
  attrToStr(addLeadingSpace: boolean = false): string {
    let str: string = ''
    each(this.attr, (value: string, key: string) => {
      str += ` ${key}="${value}"`
    })
    return addLeadingSpace ? str : trim(str)
  }

  /**
   * Get html
   */
  html(): string {
    return `<a${this.attrToStr(true)}>${toStr(this.value)}</a>`
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