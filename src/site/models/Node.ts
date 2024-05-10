import { has, toStr, toKey, isArr, count } from '../../fn'
import BaseModel from './Base'
import type { NodeModelTypes, INodeModel } from './types'
import type { Object, JSONObject } from '../../types'

export default class NodeModel extends BaseModel implements INodeModel {
  type: NodeModelTypes = 'node'

  elem: string

  attr: Object

  constructor(obj: JSONObject, type: NodeModelTypes = 'node') {
    super(obj.value ?? undefined)
    this.type = type
    this.elem = has(obj, 'elem') ? toKey(obj.elem) : ''
    this.attr = has(obj, 'attr') ? obj.attr : {}
  }

  hasChildren() {
    return this.type === 'node' && isArr(this.value)
  }

  str(): string {
    if (this.hasChildren()) {
      return `html-node ${this.elem}`
    }
    return toStr(this.value)
  }

  toJSON(): JSONObject {
    const res: Object = {
      type: this.type,
      value: this.value
    }
    if (this.elem !== '') {
      res.elem = this.elem
    }
    if (count(this.attr) > 0) {
      res.attr = this.attr
    }
    return res
  }
}