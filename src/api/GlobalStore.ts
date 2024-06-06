
import { ref } from 'vue'
import { each, has, isUrl, isArr, isStr, isBool, isObj, isLocale, toBool, toLocale, toKey } from '../fn'
import Store from './Store'
import type { Object, DateTimeFormat, IStore } from '../types'

/**
 * Store with plugin and addons options.
 */
class GlobalStore extends Store implements IStore {

  /**
   * Object with store values.
   */
  _data: Object = {

    /**
     * Options for printing out date values.
     */
    date: ref<DateTimeFormat>({ year: 'numeric', month: 'numeric', day: 'numeric' }),

    /**
     * The host url of the API, including path like
     * https://domain.com/public-api
     * but without version, which is automatically taken from ./index
     */
    host: ref<string>(''),

    /**
     * The language of the current page, used in <html lang="en">
     * and added to API requests, if it's a multilang installation.
     */
    lang: ref<string>('en'),

    /**
     * Locale in the format with -, used in <meta> and for printing
     * out date, time and numbers.
     */
    locale: ref<string>('en-EN'),

    /**
     * Flag to determine, if this is a multilanguage installation and
     * langcode must be added to API requests.
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


    routeschema: ref<string>('/:lang/:path*'),

    /**
     * Options for printing out time values.
     */
    time: ref<DateTimeFormat>({ hour: '2-digit', minute: '2-digit' }),
  }

  /**
   * Setter
   */
  set(mixed: string|Object, val?: any): void {
    let options: Object = {}
    if (isStr(mixed, 1)) {
      options[mixed] = val
    } else if (isObj(mixed)) {
      options = mixed
    }
    each(options, (val: any, key: string) => {
      switch(key) {
        case 'date':
          if (isArr(val)) { // @TODO: check array entries
            this._data.date.value = val
          }
          break
        case 'host':
          if (isUrl(val)) {
            this._data.host.value = val
          }
          break
        case 'lang':
          if (this._data.multilang.value && isStr(val)) {
            this._data.lang.value = val
          }
          break
        case 'locale':
          if (isLocale(val, false)) {
            this._data.locale.value = toLocale(val, '-')
          }
          break
        case 'multilang':
          if (isBool(val, false)) {
            this._data.multilang.value = toBool(val)
            if (!this._data.multilang.value) {
              this._data.lang.value = null
            }
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
    })
  }

  /**
   * Check, if the given language is valid.
   */
  isValidLang(code: string): boolean {
    return isStr(code, 1) && has(this._data.langcodes.value, code)
  }

  /**
   * Check, if given language is the currently selected.
   */
  isCurrentLang(code: string): boolean {
    return isStr(code, 1) && this._data.lang.value === code
  }
}

export default GlobalStore