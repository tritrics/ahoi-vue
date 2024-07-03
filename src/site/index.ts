import { isObj } from '../fn'
import { getInfo, globalStore, optionsStore } from '../plugin'
import SiteStore from './classes/SiteStore'
import PageStore from './classes/PageStore'
import Thumb from './classes/Thumb'
import AhoiHtml from './components/AhoiHtml.vue'
import AhoiLink from './components/AhoiLink.vue'
import AhoiThumb from './components/AhoiThumb.vue'
import { createThumb } from './modules/thumb'
import { convertResponse, parse } from './modules/parser'
import type { IApiAddon, ISiteStore, IPageStore } from '../types'

/**
 * Site store
 */
const siteStore: ISiteStore = new SiteStore()

/**
 * Home(page) store
 */
const homeStore: IPageStore = new PageStore()

/**
 * Page store
 */
const pageStore: IPageStore = new PageStore()

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
        globalStore.set('home', json.body.meta.home)
        if(json.body.meta.multilang) {
          globalStore.set('languages', json.body.languages ?? [])
          if (optionsStore.isTrue('langdetect')) {
            globalStore.setLangFromDetected()
            return globalStore.updateStores()
          }
          // if langdetect is false, the language must be detected by router
        } else {
          return globalStore.updateStores()
        }
      }
    })
}

/**
 * Addon factory, returns site and page
 */
export function createSite(): IApiAddon[] {
  return [{
    name: 'site',
    store: siteStore,
    components: {
      'AhoiHtml': AhoiHtml,
      'AhoiLink': AhoiLink,
      'AhoiThumb': AhoiThumb,
    },
    export: {
      store: siteStore,
      createThumb,
      convertResponse
    },
    init
  }, {
    name: 'home',
    store: homeStore,
    export: {
      store: homeStore,
    }
  }, {
    name: 'page',
    store: pageStore,
    export: {
      store: pageStore,
    }
  }]
}

/**
 * Export module
 */
export { siteStore, pageStore, Thumb, parse, createThumb, convertResponse }