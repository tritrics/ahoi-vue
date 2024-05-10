import { ref } from 'vue'
import { each, toKey, has, toBool, isStr, isUndef, isObj } from '../fn'
import { getInfo, getLanguage as getLanguageRequest } from '../api'
import { publish, inject } from '../api/plugins'
import type { IApiPlugin, JSONObject, Object } from '../types'

/**
 * Details of current language like returned from getLanguage()
 */
const data = ref<JSONObject>({})

/**
 * List of languages like returned from getInfo()
 */
const all = ref<JSONObject>({})

/**
 * Language code of current language
 */
const langcode = ref<string>('')

/**
 * Locale of current language
 */
const locale = ref<string>('')

/**
 * Flag if page is a multilanguage page
 */
const multilang = ref<boolean>(false)

/**
 * Lookup for valid languages
 * { [code]: is default }
 */
const map = ref<Object>({})

/**
 * Is it a multilanguage site or not.
 */
export function isMultilang(): boolean {
  return multilang.value === true
}

/**
 * Check, if the given language is the current language.
 */
export function isCurrent(code: string): boolean {
  return langcode.value === code
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
  return data.value[key] ?? null
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
    if (isValid(normCode) && (normCode !== langcode.value)) {
      const json: JSONObject = await getLanguageRequest(normCode, { raw: true })
      if (!isObj(json) || !json.ok) {
        return langcode.value
      }
      langcode.value = normCode
      locale.value = normalizeLocale(json.body.meta.locale)
      data.value = convertResponse(json.body)
      publish('on-changed-langcode', langcode.value)
      publish('on-changed-locale', locale.value)
      publish('on-changed-language', data.value)
    }
  }
  return langcode.value
}

/**
 * Request all available languages.
 */
async function requestLanguages(): Promise<void> {
  const json = await getInfo({ raw: true })
  multilang.value = toBool(json.body.meta.multilang)
  if (isMultilang()) {
    each(json.body.languages, (lang: Object) => {
      map.value[lang.meta.code] =  toBool(lang.meta.default)
    })
    const body = convertResponse(json)
    all.value = body.languages
  } else {
    map.value = {}
  }
  publish('on-changed-multilang', multilang.value)
  if (isMultilang()) {
    publish('on-changed-languages', () => all)
  }
}

/**
 * Check and convert to javascript locale format.
 */
function normalizeLocale(val: string): string {
  if (isStr(val)) {
    if(/^[a-z]{2,}[_]{1,}[A-Z]{2,}$/.test(val)) {
      val = val.replace('_', '-')
    }
    if(/^[a-z]{2,}[-]{1,}[A-Z]{2,}$/.test(val)) {
      return val
    }
  }
  return 'en-US'
}

/**
 * Parse response, if core plugin is installed.
 */
function convertResponse(json: JSONObject): JSONObject {
    const fn = inject('addon', 'convertResponse', (json: JSONObject): JSONObject => json)
    return fn(json)
}

/**
 * Plugin
 */
export function createI18n(): IApiPlugin {
  return {
    name: 'i18n',
    setup: async (): Promise<void> => {
      await requestLanguages()
      await setLang(detect())
    },
    export: {
      data,
      all,
      langcode,
      locale,
      isMultilang,
      isCurrent,
      isValid,
      detect,
      getTerm,
      setLang,
    }
  }
}