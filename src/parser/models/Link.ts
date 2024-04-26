import { objToAttr, extend, toBool } from '../../fn'
import { getOption } from '../index'
import { createNode } from './index'
import type { Object, JSONObject, ParserModel, LinkTypes } from '../../types'

export function createLinkByValues(type: LinkTypes, title: string, href: string): ParserModel {
  return createLink({
    value: title,
    link: {
      type,
      href
    }
  })
}

/**
 * Model for API field: link, tel, email, url
 * const router: boolean = toBool(getOption('link', 'router', options))
 */
export default function createLink(obj: JSONObject): ParserModel {
  const inject: Object = {
    $type: 'link',
    $value: obj.meta?.title ?? obj.value,
    $attributes: obj.type === 'site' ? obj.home : obj.link ?? obj.attr,
    $attr(asString: boolean = false, options: Object = {}): string|Object {
      const elemAttr: Object = { ...(this.$attributes || {}) }
      delete(elemAttr.type)
      const add = getOption('html', 'a', { a: options }) ?? {}
      const res = { ...elemAttr, ...add }
      return toBool(asString) ? objToAttr(res) : res
    }
  }
  return extend(createNode(obj), inject) as ParserModel
}