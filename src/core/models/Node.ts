import { has, toStr, toKey, isTrue, objToAttr, isArr, isUndef } from '../../fn'
import BaseModel from './Base'
import type { NodeModelTypes, INodeModel } from '../types'
import type { Object, JSONObject } from '../../types'

export default class NodeModel extends BaseModel implements INodeModel {
  _type: NodeModelTypes = 'node'

  _element?: string

  _attributes?: Object

  constructor(obj: JSONObject, type: NodeModelTypes = 'node') {
    super(obj.value ?? undefined)
    this._type = type
    if (has(obj, 'elem')) {
      this._element = toKey(obj.elem)
    }
    if (has(obj, 'attr')) {
      this._attributes = obj.attr
    }
  }

  get element(): string | undefined {
    return this._element
  }

  get attributes(): Object | undefined {
    return this._attributes
  }

  elem(): string {
    if (isUndef(this._element)) {
      return ''
    }
    return this._element
  }

  attr(asString: boolean = false): string|Object {
    if (isUndef(this._attributes) || isUndef(this._element)) {
      return isTrue(asString) ? {} : ''
    }
    return isTrue(asString) ? objToAttr(this._attributes) : this._attributes
  }

  hasChildren() {
    return this.type === 'node' && isArr(this.value)
  }

  str(): string {
    if (this.hasChildren()) {
      return `html-node ${this._element}`
    }
    return toStr(this.value)
  }
}