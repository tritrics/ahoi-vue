import { isObj } from '../utils'
import { getInfo, apiStore } from '../plugin'
import SiteStore from './classes/SiteStore'
import Thumb from './classes/Thumb'
import AhoiHtml from './components/AhoiHtml.vue'
import AhoiLink from './components/AhoiLink.vue'
import AhoiThumb from './components/AhoiThumb.vue'
import { createThumb } from './modules/thumb'
import { convertResponse, parse } from './modules/parser'
import type { Ref } from 'vue'
import type { IApiAddon, ISiteStore, IPageModel } from '../types'

/**
 * Site, Page and Home store
 */
const siteStore: ISiteStore = new SiteStore()

/**
 * Shortcuts
 * allows: const { site, home, page } = inject('api.site')
 */
const home: Ref<IPageModel> = siteStore.ref('home')
const page: Ref<IPageModel> = siteStore.ref('page')
const site: Ref<IPageModel> = siteStore.ref('site')

/**
 * Addon factory, returns site and page
 */
function createSite(): IApiAddon[] {
  return [{
    name: 'site',
    store: siteStore,
    components: {
      'AhoiHtml': AhoiHtml,
      'AhoiLink': AhoiLink,
      'AhoiThumb': AhoiThumb,
    },
    export: {
      convertResponse,
      createThumb,
      home,
      page,
      site,
      store: siteStore,
    },
    init
  }]
}

/**
 * Setup
 */
async function init(): Promise<void> {
  return Promise.resolve()
    .then(() => {
      return getInfo({ raw: true })
    })
    .then((json) => {
      if (isObj(json) && json.ok) {
        apiStore.set('home', json.body.meta.home)
        apiStore.set('error', json.body.meta.error)
        if(json.body.meta.multilang) {
          apiStore.set('languages', json.body.languages ?? [])
          if (apiStore.isTrue('langdetect')) {
            apiStore.setLangFromDetected()
            return apiStore.updateStores()
          }
          // if langdetect is false, the language must be detected by router
        } else {
          return apiStore.updateStores()
        }
      }
    })
}

/**
 * Export module
 */
export {
  convertResponse,
  createSite,
  createThumb,
  home,
  page,
  parse,
  site,
  siteStore,
  Thumb,
}