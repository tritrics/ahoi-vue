import { ref } from 'vue'
import { getPage } from '../api'
import { publish, subscribe, inject } from '../api/plugins'
import type { ApiPlugin, JSONObject } from '../types'

/**
 * original response data, parsed or not
 */
const data = ref<JSONObject>({})

/**
 * Init = request site.
 */
async function requestSite(): Promise<void> {
  const json = await getPage('/', { fields: true, raw: true })
  data.value = parseResponse(json)
  publish('on-changed-site', json.body)
}

/**
 * Parse response, if parser plugin is installed.
 */
function parseResponse(json: JSONObject): JSONObject {
  const fn = inject('parser', 'parseResponse', (json: JSONObject): JSONObject => json)
  return fn(json)
}

/**
 * Get site's data.
 * 
 * @returns {object}
 */
export function getData(): JSONObject {
  return data.value
}

/**
 * Plugin
 */
export function createSite(): ApiPlugin {
  return {
    id: 'aflevere-api-vue-site-plugin',
    name: 'site',
    init: async (): Promise<void> => {
      await requestSite()
      subscribe('on-changed-langcode', requestSite)
    },
    export: {
      getData,
    }
  }
}