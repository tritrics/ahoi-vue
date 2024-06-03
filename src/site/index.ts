import { each, has, isArr, isObj } from '../fn'
import { getFields } from '../api'
import { stores, store } from '../stores'
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
 * Request site, implicit done on init().
 */
export async function requestSite(): Promise<void> {
  const json = await getFields('/', { raw: true })
  let res: Object = {}
  if (isObj(json) && json.ok) {
    if (has(json.body.fields, 'title')) {
      stores.options.set('brand', json.body.fields.title.value)
    }
    res = convertResponse(json)
  }
  stores.site.set('meta', res.meta ?? {})
  stores.site.set('link', res.link ?? {})
  stores.site.set('fields', res.fields ?? {})
}

/**
 * Request a page
 */
export async function requestPage(path: string): Promise<void> {
  const json = await getFields(path, { raw: true })
  let res: Object = {}
  if (isObj(json) && json.ok) {
    if (has(json.body.fields, 'title')) {
      stores.options.set('title', json.body.fields.title.value)
    }
    res = convertResponse(json)
  }
  stores.page.set('meta', res.meta ?? {})
  stores.page.set('link', res.link ?? {})
  stores.page.set('fields', res.fields ?? {})
}

/**
 * @TODO
 */
async function onChangeLang(newLang: string) {
  await requestSite()
  const meta = stores.page.get('meta')
  if (has(meta, 'translations') && has(meta.translations, newLang)) {
    await requestPage(meta.translations[newLang])
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
    setup: (): void => {
      store('site', {
        'meta': {},
        'link': {},
        'fields': {}
      })
      store('page', {
        'meta': {},
        'link': {},
        'fields': {}
      })
    },
    init: async (): Promise<void> => {
      await requestSite()
      stores.options.watch('lang', onChangeLang)
    },
    export: {
      convertResponse,
      createThumb,
      requestSite,
      requestPage,
    }
  }
}