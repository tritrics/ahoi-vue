import { ref } from 'vue'
import { each, toKey, has, toBool, isStr, isUndef, isObj } from '../fn'
import { getInfo, getLanguage as getLanguageRequest } from '../api'
import { publish, inject } from '../api/plugins'
import type { ApiPlugin, JSONObject, Object } from '../types'

/**
 * Details of current language like returned from getLanguage()
 */
const data = ref<JSONObject>({})

/**
 * list of languages like returned from getInfo()
 */
const all = ref<JSONObject>({})

/**
 * INTERN lookup.
 * Needed, because languages and language may be parsed and have an unknown structure.
 */
const props = ref<{
  multilang: boolean
  code: string|null
  locale: string|null
  map: Object
}>({
  multilang: false,
  code: null, // current selected language
  locale: null, // current locale
  map: {} // map with all languages code => isDefault
})

/**
 * Is it a multilanguage site or not.
 */
export function isMultilang(): boolean {
  return props.value.multilang === true
}

/**
 * Check, if the given language is the current language.
 */
export function isCurrent(code: string): boolean {
  return props.value.code === code
}

/**
 * Check, if the given language is valid.
 */
export function isValid(code: string|null): boolean {
  if (isStr(code, 1)) {
    return has(props.value.map, code)
  }
  return false
}

/**
 * Get object with all information from the current language.
 */
export function getLang(): JSONObject {
  return data
}

/**
 * Get list with all languages.
 */
export function getAll(): JSONObject {
  return all
}

/**
 * Get the current 2-chars language code.
 */
export function getCode(): string|null {
  return props.value.code
}

/**
 * Get locale of current language.
 */
export function getLocale(): string|null {
  return props.value.locale
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
    for (const code in props.value.map) {
      if (props.value.map[code].default) {
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
    const res = toKey(code)
    if (isValid(res) && (res !== props.value.code)) {
      const json: JSONObject = await getLanguageRequest(code, { raw: true })
      if (!isObj(json) || !json.ok) {
        return props.value.code
      }
      props.value.code = code
      props.value.locale = normalizeLocale(json.body.meta.locale)
      data.value = parseResponse(json.body)
      publish('on-changed-langcode', getCode())
      publish('on-changed-locale', getLocale())
      publish('on-changed-language', getLang())
    }
  }
  return props.value.code
}

/**
 * Request all available languages.
 */
async function requestLanguages(): Promise<void> {
  const json = await getInfo({ raw: true })
  props.value.multilang = toBool(json.body.meta.multilang)
  if (isMultilang()) {
    each(json.body.languages, (lang: Object) => {
      props.value.map[lang.meta.code] =  toBool(lang.meta.default)
    })
    const body = parseResponse(json)
    all.value = body.languages
  } else {
    props.value.map = {}
  }
  publish('on-changed-multilang', props.value.multilang)
  if (isMultilang()) {
    publish('on-changed-languages', getAll())
  }
}

/**
 * Check and convert to javascript locale format.
 */
function normalizeLocale(locale: string): string {
  if (isStr(locale)) {
    if(/^[a-z]{2,}[_]{1,}[A-Z]{2,}$/.test(locale)) {
      locale = locale.replace('_', '-')
    }
    if(/^[a-z]{2,}[-]{1,}[A-Z]{2,}$/.test(locale)) {
      return locale
    }
  }
  return 'en-US'
}

/**
 * Parse response, if parser plugin is installed.
 */
function parseResponse(json: JSONObject): JSONObject {
    const fn = inject('parser', 'parseResponse', (json: JSONObject): JSONObject => json)
    return fn(json)
}

/**
 * Plugin
 */
export function createI18n(): ApiPlugin {
  return {
    id: 'tric-vue-i18n-plugin',
    name: 'i18n',
    setup: async (): Promise<void> => {
      await requestLanguages()
      await setLang(detect())
    },
    export: {
      isMultilang,
      isCurrent,
      isValid,
      detect,
      getLang,
      getAll,
      getCode,
      getLocale,
      getTerm,
      setLang,
    }
  }
}