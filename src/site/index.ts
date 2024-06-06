import { each, has, isArr, isObj } from '../fn'
import SiteStore from './SiteStore'
import PageStore from './PageStore'
import { stores, registerStore } from '../api'
import BaseModel from './models/Base'
import * as models from './models/models'
import { createThumb } from './thumb'
import AhoiHtml from './components/AhoiHtml.vue'
import AhoiLink from './components/AhoiLink.vue'
import AhoiThumb from './components/AhoiThumb.vue'
import type { IApiAddon, Object, JSONObject } from '../types'
import FileModel from './models/File'
import type { IFileModel } from './models/types'

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
    setup: (): void => {
      registerStore('site', new SiteStore())
      registerStore('page', new PageStore())
    },
    init: async (): Promise<void> => {
      await stores.site.init()
      // TODO: home-page abfragen?
    },
    export: {
      createThumb,
    }
  }
}