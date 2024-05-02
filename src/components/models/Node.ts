import { has, toStr, toKey, isTrue, objToAttr, isArr, isUndef } from '../../fn'
import BaseModel from './Base'
import type { NodeModelTypes, INodeModel } from './types'
import type { Object, JSONObject } from '../../types'

export default class NodeModel extends BaseModel implements INodeModel {
  type: NodeModelTypes = 'node'

  element?: string

  attributes?: Object

  constructor(obj: JSONObject, type: NodeModelTypes = 'node') {
    super(obj.value ?? undefined)
    this.type = type
    if (has(obj, 'elem')) {
      this.element = toKey(obj.elem)
    }
    if (has(obj, 'attr')) {
      this.attributes = obj.attr
    }
  }

  elem(): string {
    if (isUndef(this.element)) {
      return ''
    }
    return this.element
  }

  attr(asString: boolean = false): string|Object {
    if (isUndef(this.attributes) || isUndef(this.element)) {
      return isTrue(asString) ? {} : ''
    }
    return isTrue(asString) ? objToAttr(this.attributes) : this.attributes
  }

  hasChildren() {
    return this.type === 'node' && isArr(this.value)
  }

  str(): string {
    if (this.hasChildren()) {
      return `html-node ${this.element}`
    }
    return toStr(this.value)
  }
}