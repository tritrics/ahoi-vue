
import { ref } from 'vue'
import { each, count, has, isUrl, isArr, isBool, isStr, isObj, isLocale, toBool, toLocale, toKey } from '../../fn'
import BaseStore from './BaseStore'
import type { Object, DateTimeFormat, IGlobalStore } from '../../types'

/**
 * Store with plugin and addons options.
 */
class GlobalStore extends BaseStore implements IGlobalStore {

  /**
   * Object with store values.
   */
  _data: Object = {

    /**
     * Options for printing out date values.
     */
    date: ref<DateTimeFormat>({ year: 'numeric', month: 'numeric', day: 'numeric' }),

    /**
     * Reading direction of language
     * ltr = left to right
     * rtl = right to left
     */
    direction: ref<string>('ltr'),

    /**
     * The host url of the API, including path like
     * https://domain.com/public-api
     * but without version, which is automatically taken from ./index
     */
    host: ref<string>(''),

    /**
     * The language of the current page, used in <html lang="en">
     * Empty on init, because it may be a non-multilang-site.
     * Can only be set in a multilang-enviroment.
     */
    lang: ref<string>(''),

    /**
     * List with all available languages.
     * { code: meta }
     */
    languages: ref<Object[]>([]),

    /**
     * Locale in the format with -, used in <meta> and for printing
     * out date, time and numbers.
     */
    locale: ref<string>('en-EN'),

    /**
     * Flag to determine, if this is a multilanguage installation and
     * langcode must be added to API requests.
     * Automatically set to true with set('languages')
     */
    multilang: ref<boolean>(false),

    /**
     * Print textfields with linebreaks or <br />.
     */
    nl2br: ref<boolean>(false),

    /**
     * Flag to determine, if component <router-link> should be used for
     * intern links. Components itself check, if router is installed.
     */
    router: ref<boolean>(true),

    /**
     * Options for printing out time values.
     */
    time: ref<DateTimeFormat>({ hour: '2-digit', minute: '2-digit' }),
  }

  /**
   * Intern lookup map with meta-values of languages
   * {
   *   [lancode] => { meta... }
   * }
   */
  _langmap: Object = {}

  /**
   * Init store.
   * Is called, after all store instances have been created.
   */
  async init(options: Object = {}): Promise<void> {
    if (isObj(options)) {
      this._options = options
      this.set('date', this._options.date ?? null)
      this.set('direction', this._options.direction ?? null)
      this.set('host', this._options.host ?? null)
      this.set('locale', this._options.locale ?? null)
      this.set('nl2br', this._options.nl2br ?? null)
      this.set('router', this._options.router ?? null)
      this.set('time', this._options.time ?? null)
    }
  }

  /**
   * Get user option
   */
  getOption(key: string, defaultVal: any = null): any {
    return has(this._options, key) ? this._options[key] : defaultVal
  }

  /**
   * Setter
   */
  async set(key: string, val?: any): Promise<void> {
    switch(key) {
      case 'date':
        if (isArr(val)) { // @TODO: check array entries
          this._data.date.value = val
        }
        break
      case 'direction': {
        const direction = toKey(val)
        if (direction === 'ltr' || direction === 'rtl') {
          this._data.direction.value = val
        }
        break
      }
      case 'host':
        if (isUrl(val)) {
          this._data.host.value = val
        }
        break
      case 'lang': {
        const lang = toKey(val)
        if (this.isValidLang(lang)) {
          this._data.lang.value = lang
          this.set('locale', this._langmap[lang].locale)
          this.set('direction', this._langmap[lang].direction)
        }
        break
      }
      case 'languages':
        if (isArr(val) && count(val) > 0) {
          this._data.languages.value = val
          this._langmap = {}
          each(val, (language: Object) => {
            const code = language.meta.code
            this._langmap[code] = language.meta
          })
          this._data.multilang.value = true
        } else {
          this._data.multilang.value = false
        }
        break
      case 'locale':
        if (isLocale(val, false)) {
          this._data.locale.value = toLocale(val, '-')
        }
        break
      case 'nl2br':
        if (isBool(val, false)) {
          this._data.nl2br.value = toBool(val)
        }
        break
      case 'router':
        if (isBool(val, false)) {
          this._data.router.value = toBool(val)
        }
        break
      case 'time':
        if (isArr(val)) { // @TODO: check array entries
          this._data.time.value = val
        }
        break
    }
  }

  /**
   * Check, if the given language is valid.
   */
  isValidLang(code: string): boolean {
    return isStr(code, 1) && this._data.multilang.value && has(this._langmap, code)
  }

  /**
   * Check, if given language is the currently selected.
   */
  isCurrentLang(code: string): boolean {
    return isStr(code, 1) && this._data.lang.value === code
  }
}

export default GlobalStore