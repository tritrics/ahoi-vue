import { isObj } from '../utils'
import { getInfo, mainStore } from '../plugin'
import TemplateStore from './classes/TemplateStore'
import Thumb from './classes/Thumb'
import AhoiHtml from './components/AhoiHtml.vue'
import AhoiLink from './components/AhoiLink.vue'
import AhoiThumb from './components/AhoiThumb.vue'
import { createThumb } from './modules/thumb'
import { convertResponse, parse } from './modules/parser'
import type { Ref } from 'vue'
import type { IApiAddon, ITemplateStore, IPageModel } from '../types'

/**
 * Addon store
 */
const templateStore: ITemplateStore = new TemplateStore()

/**
 * Shortcuts for Site, Page and Home objects
 */
const home: Ref<IPageModel> = templateStore.ref('home')
const page: Ref<IPageModel> = templateStore.ref('page')
const site: Ref<IPageModel> = templateStore.ref('site')

/**
 * Addon factory, returns site and page
 */
function createTemplate(): IApiAddon[] {
  return [{
    name: 'template',
    store: templateStore,
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
        mainStore.set('home', json.body.meta.home)
        mainStore.set('error', json.body.meta.error)
        if(json.body.meta.multilang) {
          mainStore.set('languages', json.body.languages ?? [])
          if (mainStore.isTrue('langdetect')) {
            mainStore.setLangFromDetected()
            return mainStore.updateStores()
          }
          // if langdetect is false, the language must be detected by router
        } else {
          return mainStore.updateStores()
        }
      }
    })
}

/**
 * Export module
 */
export {
  convertResponse,
  createTemplate,
  createThumb,
  home,
  page,
  parse,
  site,
  templateStore,
  Thumb,
}