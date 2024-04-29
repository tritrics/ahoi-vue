import { has, each, extend, isArr } from '../../fn'
import { createBase, createNode, createLink } from './index'
import type { Object, JSONObject, ParserModel } from '../../types'

/**
 * Recoursive function to create Nodes from html field value.
 * Node is either a general node or a link.
 */
function createNodesRec(nodes: JSONObject[]): ParserModel[] {
  const res: ParserModel[] = []
  each(nodes, (fragment: JSONObject) => {
    if (has(fragment, 'value') && isArr(fragment.value)) {
      fragment.value = createNodesRec(fragment.value)
    }

    // Create text element
    if (!has(fragment, 'elem')) {
      res.push(createNode(fragment, 'node-text'))
    }
    
    // Create node element, eventually with special classes
    else {    
      switch(fragment?.elem) {
        case 'a':
          res.push(createLink(fragment))
          break
        case 'area':
        case 'base':
        case 'br':
        case 'col':
        case 'embed':
        case 'hr':
        case 'img':
        case 'input':
        case 'link':
        case 'meta':
        case 'param':
        case 'source':
        case 'track':
        case 'wbr':
          res.push(createNode(fragment, 'node-self-closing'))
          break
        default:
          res.push(createNode(fragment))
      }
    }
  })
  return res
}

/**
 * Model for API field: html
 */
export default function createHtml(obj: JSONObject): ParserModel {
  const inject: Object = {
    type: 'html',
    value: createNodesRec(isArr(obj.value) ? obj.value : [ obj.value ]),
    str(): string {
      return 'html-nodes'
    },
    hasChildren() {
      return isArr(this.value)
    },
  }
  return extend(createBase(), inject) as ParserModel
}