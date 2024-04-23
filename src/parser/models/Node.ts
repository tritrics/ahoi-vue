import { isArr, isTrue, toKey, toStr, extend, objToAttr } from '../../fn'
import { getOption } from '../index'
import { createBase } from './index'
import type { Object, JSONObject, ParserModel } from '../../types'

/**
 * Subnode of model for field: html
 */
export default function createNode(obj: JSONObject, type: string = 'node'): ParserModel {
  const inject: Object = {
    $type: type,
    $element: obj.elem ? toKey(obj.elem) : undefined,
    $value: obj.value ?? '',
    $attributes: obj.attr ?? undefined,
    $hasChildren() {
      return this.$type === 'node' && isArr(this.$value)
    },
    $elem() {
      return this.$element
    },
    $attr(asString: boolean = false, options: Object = {}): string|Object {
      const add: Object = getOption('html', this.$element, options) ?? {}
      const res: Object = { ...(this.$attributes), ...(add) }
      return isTrue(asString) ? objToAttr(res) : res
    },
    $str(): string {
      if (this.$hasChildren()) {
        return `html-node ${this.$elem()}`
      }
      return toStr(this.$val())
    }
  }
  return extend(createBase(), inject) as ParserModel
}