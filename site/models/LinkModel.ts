import { each, trim, toStr, ltrim } from '../../utils'
import BaseModel from '../data/BaseModel'
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
      'data-type': obj.meta?.type as LinkTypes,
      href: obj.meta?.href as string
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

  /**
   * Get href of link-type url as relative path (strip host),
   * because Kirby doesn't allow relative paths in url-field
   */
  relPath(): string {
    if (this.attr['data-type'] === 'url') {
      const url = new URL(this.attr.href)
      const reg = new RegExp(String.raw`^(${url.origin})`, 'g')
      return '/' + ltrim(this.attr.href.replace(reg, ''), '/')
    }
    return ''
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