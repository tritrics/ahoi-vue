import { has, each, extend, isArr } from '../../fn'
import { createBase, createHtmlNode } from './index'
import type { Object, JSONObject, ParserModel } from '../../types'

/**
 * Recoursive function to create HtmlNodes from html field value.
 */
function createNodes(nodes: JSONObject[]): ParserModel[] {
  const res: ParserModel[] = []
  each(nodes, (fragment: JSONObject) => {
    if (has(fragment, 'value') && isArr(fragment.value)) {
      fragment.value = createNodes(fragment.value)
    }
    res.push(createHtmlNode(fragment))
  })
  return res
}

/**
 * Model for API field: html
 */
export default function createHtml(obj: JSONObject): ParserModel {
  const inject: Object = {
    $type: 'html',
    $value: createNodes(isArr(obj.value) ? obj.value : [ obj.value ]),

    // unlike in Node, the functions $tag() and $str() both return the same,
    // because this object is a representation of the writer-field and 
    // $value holds only a collection of html-nodes.
    // Other functions like $attr() don't make sense here.
    $tag(options: Object = {}): string {
      return this.$str(options)
    },
    $str(options: Object = {}): string {
      const res: string[] = []
      each(this.$value, (node: ParserModel) => {
        res.push(node.$tag(options))
      })
      return res.join('')
    },
  }
  return extend(createBase(), inject) as ParserModel
}