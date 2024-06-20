import { isObj, isStr, isUndef } from '../fn'
import { getInfo, globalStore, optionsStore } from '../plugin'
import SiteStore from './classes/SiteStore'
import PageStore from './classes/PageStore'
import Thumb from './classes/Thumb'
import AhoiHtml from './components/AhoiHtml.vue'
import AhoiLink from './components/AhoiLink.vue'
import AhoiThumb from './components/AhoiThumb.vue'
import AhoiLangSwitch from './components/AhoiLangSwitch.vue'
import { createThumb } from './modules/thumb'
import { convertResponse, parse } from './modules/parser'
import type { IApiAddon, ISiteStore, IPageStore } from '../types'

/**
 * Site store
 */
let siteStore: ISiteStore

/**
 * Page store
 */
let pageStore: IPageStore

/**
 * Setup
 */
async function init(): Promise<void> {
  // requesting info
  const json = await getInfo({ raw: true })
  if (!isObj(json) || !json.ok) {
    return
  }

  // setting languages
  if(json.body.meta.multilang) {
    globalStore.set('languages', json.body.languages ?? [])
  }

  // setting other infos
  globalStore.set('home', json.body.meta.home)

  // if multilang: detect and select language
  if (globalStore.isTrue('multilang')) {
    await globalStore.set('lang', detectLanguage())
  }
}

/**
 * Detect the best valid language from browser or settings.
 */
function detectLanguage(): string|null {

  // 1. from url
  const urlLang = globalStore.getLangFromUrl()
  if (isStr(urlLang, 1)) {
    return urlLang
  }

  // 2. from user options
  const userLang = optionsStore.get('lang')
  if (globalStore.isValidLang(userLang)) {
    return userLang
  }

  // 3. from browser
  for (let i = 0; i < navigator.languages.length; i++) {
    const navLang: string|undefined = navigator.languages[i].toLowerCase().split('-').shift()
    if (!isUndef(navLang) && globalStore.isValidLang(navLang)) {
      return navLang
    }
  }

  // 4. default lang
  return globalStore.getDefaultLang()
}

/**
 * Addon factory, returns site and page
 */
export function createSite(): Function {
  return (): IApiAddon[] => {
    siteStore = new SiteStore()
    pageStore = new PageStore()
    return [{
      name: 'site',
      store: siteStore,
      components: {
        'AhoiHtml': AhoiHtml,
        'AhoiLink': AhoiLink,
        'AhoiThumb': AhoiThumb,
        'AhoiLangSwitch': AhoiLangSwitch,
      },
      export: {
        store: siteStore,
        createThumb,
        convertResponse
      },
      init: async (): Promise<void> => {
        console.log('site addon init', 'start')
        await init()
        console.log('site addon init', 'ready')
      },
    }, {
      name: 'page',
      store: pageStore,
      export: {
        store: pageStore,
      }
    }]
  }
}

/**
 * Export module
 */
export { siteStore, pageStore, parse, createThumb, convertResponse, Thumb }