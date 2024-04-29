import { isArr, isTrue, toKey, toStr, extend, objToAttr } from '../../fn'
import { getOption } from '../index'
import { createBase } from './index'
import type { Object, JSONObject, ParserModel } from '../../types'

/**
 * Subnode of model for field: html
 */
export default function createNode(obj: JSONObject, type: string = 'node'): ParserModel {
  const inject: Object = {
    type: type,
    value: obj.value ?? '',
    element: obj.elem ? toKey(obj.elem) : undefined,
    attributes: obj.attr ?? undefined,
    str(): string {
      if (this.hasChildren()) {
        return `html-node ${this.elem()}`
      }
      return toStr(this.value)
    },
    attr(asString: boolean = false, options: Object = {}): string|Object {
      const add: Object = getOption('html', this.element, options) ?? {}
      const res: Object = { ...(this.attributes), ...(add) }
      return isTrue(asString) ? objToAttr(res) : res
    },
    hasChildren() {
      return this.type === 'node' && isArr(this.$value)
    },
  }
  return extend(createBase(), inject) as ParserModel
}