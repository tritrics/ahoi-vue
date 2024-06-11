import { each, isObj, isTrue, isUndef } from '../fn'
import { getInfo, globalStore } from '../plugin'
import SiteStore from './classes/SiteStore'
import PageStore from './classes/PageStore'
import Thumb from './classes/Thumb'
import AhoiHtml from './components/AhoiHtml.vue'
import AhoiLink from './components/AhoiLink.vue'
import AhoiThumb from './components/AhoiThumb.vue'
import AhoiLangSwitch from './components/AhoiLangSwitch.vue'
import { createThumb } from './modules/thumb'
import { convertResponse, parse } from './modules/parser'
import type { IApiAddon, Object, ISiteStore, IPageStore } from '../types'

/**
 * Site store
 */
const siteStore: ISiteStore = new SiteStore()

/**
 * Page store
 */
const pageStore: IPageStore = new PageStore()

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

  // ... setting other infos

  // if multilang: detect and select language
  if (globalStore.isTrue('multilang')) {
    globalStore.set('lang', detectLanguage())
  }
}

/**
 * Detect the best valid language from browser or settings.
 */
function detectLanguage(): string|null {

  // 1. lang given by options
  const userLang = globalStore.getOption('lang')
  if (globalStore.isValidLang(userLang)) {
    return userLang
  }

  // 2. lang from browser
  for (let i = 0; i < navigator.languages.length; i++) {
    const code: string|undefined = navigator.languages[i].toLowerCase().split('-').shift()
    if (!isUndef(code) && globalStore.isValidLang(code)) {
      return code
    }
  }

  // 3. default lang
  const languages = globalStore.get('languages')
  let res: string|null = languages[0].meta.code
  each(globalStore.get('languages'), (language: Object) => {
    if (isTrue(language.meta.default)) {
      res = language.meta.code
    }
  })
  return res
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
      'AhoiLangSwitch': AhoiLangSwitch,
    },
    export: {
      store: siteStore,
      createThumb,
      convertResponse
    },
    init: async (): Promise<void> => {
      await init()
    },
  }, {
    name: 'page',
    store: pageStore,
    export: {
      store: pageStore,
    },
  }]
}

/**
 * Export module
 */
export { siteStore, pageStore, parse, createThumb, convertResponse, Thumb }