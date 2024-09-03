import { has, each, count, trim, htmlentities, toStr, toKey, isArr } from '../../fn'
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
   * Get attributes as a string to be used in html-element
   */
  attrToStr(addLeadingSpace: boolean = false): string {
    let str: string = ''
    each(this.attr, (value: string, key: string) => {
      str += ` ${key}="${htmlentities(value, 'quotes')}"`
    })
    return addLeadingSpace ? str : trim(str)
  }

  /**
   * Check, if node has nodes as child
   */
  hasChildren() {
    return this.type === 'node' && isArr(this.value)
  }

  /**
   * Get html, recoursive
   */
  html(): string {
    switch(this.type) {
      case 'node-text':
        return toStr(this.value)
      case 'node-self-closing':
        return `<${this.elem}${this.attrToStr(true)} />`
      default: {
        let html: string = `<${this.elem}${this.attrToStr(true)}>`
        if (this.hasChildren()) {
          each(this.value, (node: INodeModel) => {
            html += node.html()
          })
        } else {
          html += toStr(this.value)
        }
        html += `</${this.elem}>`
        return html
      }
    }
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