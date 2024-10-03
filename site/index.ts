import { ref } from 'vue'
import { isObj } from '../utils'
import { getInfo, globalStore, optionsStore } from '../plugin'
import SiteStore from './classes/SiteStore'
import Thumb from './classes/Thumb'
import AhoiHtml from './components/AhoiHtml.vue'
import AhoiLink from './components/AhoiLink.vue'
import AhoiThumb from './components/AhoiThumb.vue'
import { createThumb } from './modules/thumb'
import { convertResponse, parse } from './modules/parser'
import type { Ref } from 'vue'
import type { IApiAddon, ISiteStore, ISiteModel, IPageModel, ISiteRefs } from '../types'

/**
 * Site, Page and Home store
 */
const siteStore: ISiteStore = new SiteStore()

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
 * get models
 */
function siteRefs(): ISiteRefs {
  return {
    site: siteStore.ref('site') as Ref<ISiteModel>,
    home: siteStore.ref('home') as Ref<IPageModel>,
    page: siteStore.ref('page') as Ref<IPageModel|null>,
  }
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
      convertResponse,
      siteRefs
    },
    init
  }]
}

/**
 * Export module
 */
export {
  siteStore,
  Thumb,
  parse,
  createThumb,
  convertResponse,
  siteRefs
}