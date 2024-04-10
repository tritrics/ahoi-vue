import { has, each, isArr, inArr, isStr, isTrue, toKey, extend, objToAttr } from '../../fn'
import { getOption } from '../index'
import { createBase } from './index'
import { getLinkAttributes } from './Link'
import type { Object, JSONObject, ParserModel } from '../../types'

/**
 * Array with self-closing html nodes
 */
const selfClosing = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']

/**
 * Subnode of model for field: html
 */
export default function createHtmlNode(obj: JSONObject): ParserModel {
  const inject: Object = {
    $type: 'htmlnode',
    $element: has(obj, 'elem') ? toKey(obj.elem) : null,
    $value: obj.value,
    $attributes: obj.attr ?? null,
    $isSelfClosing() {
      return has(this, '$element') && inArr(this.$element, selfClosing)
    },
    $isNode() {
      return this.$element !== null
    },
    $isText() {
      return this.$element === null
    },
    $isLink() {
      return this.$element === 'a'
    },
    $hasChildren() {
      return isArr(this.$value)
    },
    $elem() { // the html-element
      return has(this, '$element') ? this.$element : null
    },
    $attr(asString: boolean = false, options: Object = {}): string|Object { // attributes as string or object
      if (this.$isLink()) {
        return getLinkAttributes(this.$element, this.$attributes, asString, options)
      } else {
        const add: Object = getOption('html.attr', options)
        const res: Object = { ...(this.$attributes || {}), ...(add[this.$element] || {}) }
        return isTrue(asString) ? objToAttr(res) : res
      }
    },
    $tag(options: Object = {}) { // string including this elem = complete html-tag
      if (this.$isText()) {
        return `${this.$value}`
      }
      let attr: string = this.$attr(true, options)
      if (isStr(attr, 1)) {
        attr = ` ${attr}`
      }
      if (this.$isSelfClosing()) {
        return `<${this.$element}${attr} />`
      }
      return `<${this.$element}${attr}>${this.$str(options)}</${this.$element}>`
    },
    $str(options: Object = {}): string { // string of children ($value)
      if (!this.$hasChildren()) {
        return `${this.$value}`
      }
      const children: string[] = []
      each(this.$value, (child: ParserModel) => {
        children.push(child.$tag(options))
      })
      return children.join('')
    }
  }
  return extend(createBase(), inject) as ParserModel
}