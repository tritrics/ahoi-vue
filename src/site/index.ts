import { ref } from 'vue'
import { each, has, isArr, isObj } from '../fn'
import { getFields } from '../api'
import { store } from '../store'
import BaseModel from './models/Base'
import * as models from './models/models'
import { createThumb } from './thumb'
import AhoiHtml from './components/AhoiHtml.vue'
import AhoiLink from './components/AhoiLink.vue'
import AhoiThumb from './components/AhoiThumb.vue'
import type { IApiAddon, Object, JSONObject } from '../types'

/**
 * workaround to add types to models
 */
const modelsMap: Object = models

/**
 * original response data, parsed or not
 */
const site = ref<JSONObject>({})

/**
 * Init = request site.
 */
async function requestSite(): Promise<void> {
  const json = await getFields('/', { raw: true })
  if (isObj(json) && json.ok) {
    if (has(json.body.meta, 'title')) {
      store.set('brand', json.body.meta.title)
    }
    site.value = convertResponse(json)
  }
}

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
 * Addon
 */
export function createSite(): IApiAddon {
  return {
    name: 'site',
    components: {
      'AhoiHtml': AhoiHtml,
      'AhoiLink': AhoiLink,
      'AhoiThumb': AhoiThumb,
    },
    init: async (): Promise<void> => {
      await requestSite()
      store.watch('lang', requestSite)
    },
    export: {
      convertResponse,
      createThumb,
      site
    }
  }
}