import { ref } from 'vue'
import { each, toKey, has, toBool, isStr, isUndef, isObj, toLocale } from '../fn'
import { getInfo, getLanguage as getLanguageRequest } from '../api'
import { store } from '../api/store'
import { inject } from '../api/addons'
import type { IApiAddon, JSONObject, Object } from '../types'

/**
 * Details of current language like returned from getLanguage()
 */
const terms = ref<JSONObject>({})

/**
 * List of languages like returned from getInfo()
 */
const all = ref<JSONObject>({})

/**
 * Lookup for valid languages
 * { [code]: is default }
 */
const map = ref<Object>({})

/**
 * Is it a multilanguage site or not.
 */
export function isMultilang(): boolean {
  return store.get('multilang') === true
}

/**
 * Get current language.
 */
export function getCurrent(): string {
  return store.get('lang')
}

/**
 * Check, if the given language is the current language.
 */
export function isCurrent(code: string): boolean {
  return store.get('lang') === code
}

/**
 * Check, if the given language is valid.
 */
export function isValid(code: string|null): boolean {
  if (isStr(code, 1)) {
    return has(map.value, code)
  }
  return false
}

/**
 * Get a term given by key.
 */
export function getTerm(key: string): string|number|null {
  return terms.value[key] ?? null
}

/**
 * Detect the best valid language from browser or settings.
 * 
 * @param {boolean} getUser try to get the language from browser
 * @param {boolean} getDefault get default language like defined in Kirby if detection fails
 */
export function detect(getUser: boolean = true, getDefault: boolean = true): string|null {
  let res: string|null = null
  if (getUser) {
    for (let i = 0; i < navigator.languages.length; i++) {
      const code: string|undefined = navigator.languages[i].toLowerCase().split('-').shift()
      if (!isUndef(code) && isValid(code)) {
        res = code
        break
      }
    }
  }
  if (getDefault && !isValid(res)) {
    for (const code in map.value) {
      if (map.value[code].default) {
        res = code
        break
      }
    }
  }
  return res
}

/**
 * Setting a language with implicit requesting all language data from Kirby.
 */
export async function setLang(code: string|null): Promise<string|null> {
  if (isMultilang() && isStr(code, 1)) {
    const normCode = toKey(code)
    if (isValid(normCode) && (normCode !== store.get('lang'))) {
      const json: JSONObject = await getLanguageRequest(normCode, { raw: true })
      if (!isObj(json) || !json.ok) {
        return store.get('lang')
      }
      terms.value = convertResponse(json.body)
      console.log('i18n')
      store.set('lang', normCode)
      store.set('locale', toLocale(json.body.meta.locale, '-'))
      store.set('direction', json.body.meta.direction)
    }
  }
  return store.get('lang')
}

/**
 * Request all available languages.
 */
async function requestLanguages(): Promise<void> {
  const json = await getInfo({ raw: true })
  store.set('multilang', toBool(json.body.meta.multilang))
  if (isMultilang()) {
    each(json.body.languages, (lang: Object) => {
      map.value[lang.meta.code] =  toBool(lang.meta.default)
    })
    const body = convertResponse(json)
    all.value = body.languages
  } else {
    map.value = {}
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
 * Plugin
 */
export function createI18n(): IApiAddon {
  return {
    name: 'i18n',
    setup: async (): Promise<void> => {
      await requestLanguages()
      await setLang(detect())
    },
    export: {
      terms,
      all,
      isMultilang,
      isCurrent,
      isValid,
      getCurrent,
      detect,
      getTerm,
      setLang,
    }
  }
}