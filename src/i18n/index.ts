import { ref } from 'vue'
import { each, toKey, has, clone, toBool, isStr, isUndef, isObj } from '../fn'
import { getInfo, getLanguage as getLanguageRequest } from '../api'
import { publish, inject } from '../plugins'
import type { ApiPlugin, JSONObject, Object } from '../types'

/**
 * list of languages like returned from getInfo()
 */
const languages = ref<JSONObject>({})

/**
 * Details of current language like returned from getLanguage()
 */
const language = ref<JSONObject>({})

/**
 * Terms as (optionally) defined in Kirby's language settings.
 */
const terms = ref<JSONObject>({})

/**
 * INTERN lookup.
 * Needed, because languages and language may be parsed and have an unknown structure.
 */
const data = ref<{
  multilang: boolean
  current: string|null
  map: Object
}>({
  multilang: false,
  current: null,
  map: {}
})

/**
 * Is it a multilanguage site or not.
 */
export function isMultilang(): boolean {
  return data.value.multilang === true
}

/**
 * Check, if the given language is the current language.
 */
export function isLanguage(lang: string): boolean {
  return data.value.current === lang
}

/**
 * Check, if the given language is valid.
 */
export function isValidLanguage(lang: string|null): boolean {
  if (isStr(lang, 1)) {
    return has(data.value.map, lang)
  }
  return false
}

/**
 * Get list with all languages.
 */
export function getLanguages(): JSONObject {
  return languages.value
}

/**
 * Get object with all information from the current language.
 */
export function getLanguage(): JSONObject {
  return language.value
}

/**
 * Get the current 2-chars language code.
 */
export function getLangcode(): string|null {
  return data.value.current
}

/**
 * Get locale of current language.
 */
export function getLocale(): string|null {
  if (isStr(data.value.current, 1)) {
    return data.value.map[data.value.current].locale
  }
  return null
}

/**
 * Get a term given by key.
 */
export function getTerm(key: string): string|number|null {
  return terms.value[key] || null
}

/**
 * Get all terms.
 */
export function getTerms(): JSONObject {
  return terms.value
}

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
      const lang: string|undefined = navigator.languages[i].toLowerCase().split('-').shift()
      if (!isUndef(lang) && isValidLanguage(lang)) {
        res = lang
        break
      }
    }
  }
  if (getDefault && !isValidLanguage(res)) {
    for (const lang in data.value.map) {
      if (data.value.map[lang].default) {
        res = lang
        break
      }
    }
  }
  return res
}

/**
 * Setting a language with implicit requesting all language data from Kirby.
 */
export async function setLanguage(lang: string|null): Promise<string|null> {
  if (isMultilang() && isStr(lang, 1)) {
    const res = toKey(lang)
    if (isValidLanguage(res) && (res !== data.value.current)) {
      const json: JSONObject = await getLanguageRequest(lang, { raw: true })
      if (!isObj(json) || !json.ok) {
        return data.value.current
      }
      data.value.current = lang
      data.value.map[data.value.current].locale = normalizeLocale(json.body.meta.locale)
      terms.value = clone(json.body.terms)
      language.value = parseResponse(json.body)
      publish('on-changed-langcode', getLangcode())
      publish('on-changed-locale', getLocale())
      publish('on-changed-language', getLanguage())
    }
  }
  return data.value.current
}

/**
 * Request all available languages.
 */
async function requestLanguages(): Promise<void> {
  const json = await getInfo({ raw: true })
  data.value.multilang = toBool(json.body.meta.multilang)
  if (isMultilang()) {
    each(json.body.value.languages.value, (props: Object) => {
      data.value.map[props.meta.code] = {
        default: toBool(props.meta.default),
      }
    })
    languages.value = parseResponse(json.body.value.languages) // parse does nothing if not parser exists
  } else {
     data.value.map = {}
  }
  publish('on-changed-multilang', data.value.multilang)
  if (isMultilang()) {
    publish('on-changed-languages', getLanguages())
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
    id: 'avlevere-api-vue-i18n-plugin',
    name: 'i18n',
    setup: async (): Promise<void> => {
      await requestLanguages()
      await setLanguage(detectLanguage())
    },
    export: {
      detectLanguage,
      getLangcode,
      getLanguage,
      getLanguages,
      getLocale,
      isMultilang,
      isLanguage,
      isValidLanguage,
      setLanguage,
      getTerm,
      getTerms,
    }
  }
}