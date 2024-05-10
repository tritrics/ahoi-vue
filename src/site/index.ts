import { ref } from 'vue'
import { each, has, isArr, isObj } from '../fn'
import { getFields } from '../api'
import { publish, subscribe } from '../api/plugins'
import Options from './Options'
import { setMeta } from './meta'
import BaseModel from './models/Base'
import * as models from './models/models'
import { createThumb } from './Thumb'
import AhoiHtml from './components/AhoiHtml.vue'
import AhoiLink from './components/AhoiLink.vue'
import AhoiThumb from './components/AhoiThumb.vue'
import type { IsiteOptions } from './types'
import type { IApiPlugin, Object, JSONObject } from '../types'

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
      setMeta({ brand: json.body.meta.title })
    }
    site.value = convertResponse(json)
    publish('on-changed-site', json.body)
  }
}

/**
 * Options for models.
 */
export const siteOptions = new Options({
  router: true, // AhoiLink checks if router is installed
  title: 'Home',
  brand: '',
  title_separator: ' - ',
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
  siteOptions.set('locale', locale)
  setMeta({ locale: locale })
}

/**
 * Plugin
 */
export function createSite(options: IsiteOptions = {}): IApiPlugin {
  siteOptions.set(options)
  return {
    name: 'site',
    components: {
      'AhoiHtml': AhoiHtml,
      'AhoiLink': AhoiLink,
      'AhoiThumb': AhoiThumb,
    },
    init: async (): Promise<void> => {
      await requestSite()
      subscribe('on-changed-langcode', requestSite)
      subscribe('on-changed-locale', setLocale)
    },
    export: {
      convertResponse,
      createThumb,
      siteOptions,
      setMeta,
      site
    }
  }
}