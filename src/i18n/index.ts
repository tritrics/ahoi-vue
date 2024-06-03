import { each, toKey, toBool, isStr, isUndef, isObj, toLocale } from '../fn'
import { getInfo, getLanguage } from '../api'
import { store, stores } from '../stores'
import { inject } from '../addons'
import AhoiLangSwitch from './components/AhoiLangSwitch.vue'
import type { IApiAddon, JSONObject, Object } from '../types'

/**
 * Detect the best valid language from browser or settings.
 * 
 * @param {boolean} getUser try to get the language from browser
 * @param {boolean} getDefault get default language like defined in Kirby if detection fails
 */
export function detectLanguage(getUser: boolean = true, getDefault: boolean = true): string|null {
  let res: string|null = null
  if (getUser) {
    for (let i = 0; i < navigator.languages.length; i++) {
      const code: string|undefined = navigator.languages[i].toLowerCase().split('-').shift()
      if (!isUndef(code) && stores.options.isValidLang(code)) {
        res = code
        break
      }
    }
  }
  if (getDefault && !stores.options.isValidLang(res)) {
    each(stores.options.languages, (language: Object, code: string) => {
      if (language.default) {
        res = code
      }
    })
  }
  return res
}

/**
 * Setting a language with implicit requesting all language data from Kirby.
 */
export async function setLanguage(code: string|null): Promise<string|null> {
  if (stores.options.get('multilang') && isStr(code, 1)) {
    const normCode = toKey(code)
    if (stores.options.isValidLang(normCode) && (normCode !== stores.options.get('lang'))) {
      const json: JSONObject = await getLanguage({ lang: normCode, raw: true })
      if (!isObj(json) || !json.ok) {
        return stores.options.get('lang')
      }
      stores.options.set('lang', normCode)
      stores.options.set('locale', toLocale(json.body.meta.locale, '-'))
      stores.options.set('direction', json.body.meta.direction)
      const parsed = convertResponse(json)
      stores.i18n.set('terms', parsed.fields)
    }
  }
  return stores.options.get('lang')
}

/**
 * Request all available languages.
 */
async function requestLanguages(): Promise<void> {
  const json = await getInfo({ raw: true })
  stores.options.set('multilang', toBool(json.body.meta.multilang))
  if (stores.options.get('multilang')) {
    const body = convertResponse(json)
    stores.options.set('languages', body.languages)
  } else {
    stores.options.set('languages', {})
  }
}

/**
 * Parse response, if core plugin is installed.
 */
function convertResponse(json: JSONObject): JSONObject {
    const fn = inject('site', 'convertResponse', (json: JSONObject): JSONObject => json)
    return fn(json)
}

/**
 * Addon
 */
export function createI18n(): IApiAddon {
  return {
    name: 'i18n',
    components: {
      'AhoiLangSwitch': AhoiLangSwitch,
    },
    setup: async (): Promise<void> => {
      store('i18n', {
        'terms': {}
      })
      await requestLanguages()
      await setLanguage(detectLanguage())
    },
    export: {
      detectLanguage,
      setLanguage,
    }
  }
}