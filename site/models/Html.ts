import { each, has, isArr } from '../../utils'
import BaseModel from './Base'
import NodeModel from './Node'
import LinkModel from './Link'
import type { IHtmlModel, INodeModel } from '../types'
import type { JSONObject, Object } from '../../types'

/**
 * Model representing a text field with html (writer...).
 */
export default class HtmlModel extends BaseModel implements IHtmlModel {
  
  /**
   * Type
   */
  type: 'html' = 'html'

  /** */
  constructor(obj: JSONObject) {
    super(createNodesRec(isArr(obj.value) ? obj.value : [ obj.value ]))
  }

  /**
   * Getter for value as string
   */
  str(options: Object = {}): string {
    if (this.has()) {
      let html: string = ''
      each (this.value, (node: INodeModel) => {
        html += node.html(options)
      })
      return html
    }
    return ''
  }
  
  /**
   * Flag to check, if child nodes exist
   */
  has(): boolean {
    return isArr(this.value)
  }
}

/**
 * Recoursive function to create Nodes from html field value.
 * Node is either a general node or a link.
 */
function createNodesRec(nodes: JSONObject[]): BaseModel[] {
  const res: BaseModel[] = []
  each(nodes, (fragment: JSONObject) => {
    if (has(fragment, 'value') && isArr(fragment.value)) {
      fragment.value = createNodesRec(fragment.value)
    }

    // Create text element
    if (!has(fragment, 'elem')) {
      res.push(new NodeModel(fragment, 'node-text'))
    }
    
    // Create node element, eventually with special classes
    else {    
      switch(fragment?.elem) {
        case 'a':
          res.push(new LinkModel(fragment))
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
          res.push(new NodeModel(fragment, 'node-self-closing'))
          break
        default:
          res.push(new NodeModel(fragment))
      }
    }
  })
  return res
}