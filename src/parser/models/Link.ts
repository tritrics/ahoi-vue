import { objToAttr, extend, toBool, isStr } from '../../fn'
import { getOption } from '../index'
import { createBase } from './index'
import type { Object, JSONObject, ParserModel } from '../../types'

/**
 * Helper function to get link attributes.
 * Exported for use in other models.
 */
export function getLinkAttributes(
  element: string,
  attributes: Object,
  asString: boolean,
  options: Object
): Object|string
{
  const router: boolean = toBool(getOption('link', 'router', options))
  const elemAttr: Object = { ...(attributes || {}) }
  if (elemAttr.type === 'page' && router) {
    elemAttr.to = elemAttr.href
    elemAttr['router-link'] = null
    delete(elemAttr.href)
  }
  elemAttr[`data-link-${elemAttr.type}`] = null
  delete(elemAttr.type)
  const add = getOption('html', 'a', { a: options }) ?? {}
  console.log(options, add)
  const res = { ...elemAttr, ...add }
  return toBool(asString) ? objToAttr(res) : res
}

/**
 * Model for API field: link, tel, email, url
 */
export default function createLink(obj: JSONObject): ParserModel {
  const inject: Object = {
    $type: 'link',
    $elem: 'a', // analog to HtmlNode
    $value: (obj.type === 'page' || obj.type === 'file' || obj.type === 'image' || obj.type === 'site') ? obj.meta.title : obj.value,
    $attributes: obj.type === 'site' ? obj.home : obj.link,
    $attr(asString: boolean = false, options: Object = {}): string|Object {
      return getLinkAttributes('a', this.$attributes, asString, options)
    },
    $tag(options: Object = {}) { // analog to HtmlNode
      let attr = this.$attr(true, options)
      if (isStr(attr)) {
        attr = ` ${attr}`
      }
      return `<a${attr}>${this.$str(options)}</a>`
    },
  }
  return extend(createBase(), inject) as ParserModel
}