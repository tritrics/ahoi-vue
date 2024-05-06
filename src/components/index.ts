import { each, has, isArr, isObj, Options } from '../fn'
import { subscribe } from '../api/plugins'
import BaseModel from './models/Base'
import * as models from './models/models'
import { createThumb } from './Thumb'
import AhoiHtml from './components/AhoiHtml.vue'
import AhoiLink from './components/AhoiLink.vue'
import AhoiThumb from './components/AhoiThumb.vue'
import type { IComponentOptions, IApiPlugin, Object, JSONObject } from '../types'

/**
 * workaround to add types to models
 */
const modelsMap: {
  [ key: string ]: typeof BaseModel
} = models

/**
 * Options for models.
 */
export const componentOptions = new Options({
  router: false,
  locale: 'en-US',
  nl2br: false,
  date: { year: 'numeric', month: 'numeric', day: 'numeric' },
  time: { hour: '2-digit', minute: '2-digit' },
})

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
export function parseModelsRec(nodes: JSONObject): Object|JSONObject {
  if (isObj(nodes)) {
    if (has(nodes, 'type')) {
      return createModel(nodes)
    }
    const res: Object = {}
    each(nodes, (node: JSONObject, key: string) => {
      res[key] = parseModelsRec(node)
    })
    return res as Object
  } else if (isArr(nodes)) {
    const res: Object[] = []
    each(nodes, (node: JSONObject) => {
      res.push(parseModelsRec(node))
    })
    return res
  }
  return nodes
}

/**
 * Change locale in Options.
 */
function setLocale(locale: string): void {
  componentOptions.set('locale', locale)
}

/**
 * Plugin
 */
export function createComponents(options: IComponentOptions = {}): IApiPlugin {
  componentOptions.set(options)
  return {
    name: 'components',
    components: {
      'AhoiHtml': AhoiHtml,
      'AhoiLink': AhoiLink,
      'AhoiThumb': AhoiThumb,
    },
    init: () => {
      subscribe('on-changed-locale', setLocale)
    },
    export: {
      convertResponse,
      createThumb,
    }
  }
}