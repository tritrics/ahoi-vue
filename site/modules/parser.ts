import { each, has, isArr, isObj } from '../../fn'
import BaseModel from '../models/Base'
import * as models from '../models/models'
import type { Object, JSONObject } from '../../types'

/**
 * workaround to add types to models
 */
const modelsMap: Object = models

/**
 * Main function to convert json from response to models.
 */
export function convertResponse(json: JSONObject): Object {
  return has(json, 'body') ? createModel(json.body) : json
}

/**
 * Create a model.
 */
function createModel(node: JSONObject) {
  const type = node.type ?? 'base'
  if (modelsMap[type] !== undefined) {
    return new modelsMap[type](node)
  }
  return new BaseModel(node)
}

/**
 * Recoursively parse node for models.
 */
export function parse(nodes: JSONObject): Object|JSONObject {
  if (isObj(nodes)) {
    if (has(nodes, 'type')) {
      return createModel(nodes)
    }
    const res: Object = {}
    each(nodes, (node: JSONObject, key: string) => {
      res[key] = parse(node)
    })
    return res as Object
  } else if (isArr(nodes)) {
    const res: Object[] = []
    each(nodes, (node: JSONObject) => {
      res.push(parse(node))
    })
    return res
  }
  return nodes
}