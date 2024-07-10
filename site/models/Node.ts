import { has, toStr, toKey, isArr, count } from '../../fn'
import BaseModel from './Base'
import type { NodeModelTypes, INodeModel } from '../types'
import type { Object, JSONObject } from '../../types'

/**
 * Model representing a html-node in html-model.
 */
export default class NodeModel extends BaseModel implements INodeModel {
  
  /**
   * Type
   */
  type: NodeModelTypes = 'node'

  /**
   * HTML element
   */
  elem: string

  /**
   * Attributes
   */
  attr: Object

  /** */
  constructor(obj: JSONObject, type: NodeModelTypes = 'node') {
    super(obj.value ?? undefined)
    this.type = type
    this.elem = has(obj, 'elem') ? toKey(obj.elem) : ''
    this.attr = has(obj, 'attr') ? obj.attr : {}
  }

  /**
   * Check, if node has nodes as child
   */
  hasChildren() {
    return this.type === 'node' && isArr(this.value)
  }

  /**
   * Getter for value as string
   */
  str(): string {
    if (this.hasChildren()) {
      return `html-node ${this.elem}`
    }
    return toStr(this.value)
  }

  /** */
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