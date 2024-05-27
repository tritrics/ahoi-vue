import { ref, watch, toRef } from 'vue'
import { each, has, isUrl, isArr, isStr, isBool, isLocale, toBool, toLocale, toKey } from '../fn'
import type { Ref, WatchCallback, WatchOptions, WatchStopHandle } from 'vue'
import type { Object, DateTimeFormat } from '../types'

interface IStore {
  get(key: string): any
  ref(key: string): Ref
  set(key: string, val: any): void
  setOptions(obj: Object): void
  watch<T>(source: string|string[], callback: WatchCallback<T>, options?: WatchOptions): Function
}

/**
 * Simple store with app prefs and user added values.
 */
class Store implements IStore {

  /**
   * Object with store values.
   */
  _data: Object = {

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
     * Reading direction of language
     * ltr = left to right
     * rtl = right to left
     */
    direction: ref<string>('ltr'),

    /**
     * Brand of the page (= site title)
     */
    brand: ref<string>(''),

    /**
     * Separator to combine brand and title in <title>.
     */
    separator: ref<string>(' - '),

    /**
     * Print textfields with linebreaks or <br />.
     */
    nl2br: ref<boolean>(false),

    /**
     * Options for printing out date values.
     */
    date: ref<DateTimeFormat>({ year: 'numeric', month: 'numeric', day: 'numeric' }),

    /**
     * Options for printing out time values.
     */
    time: ref<DateTimeFormat>({ hour: '2-digit', minute: '2-digit' }),

    /**
     * Flag to determine, if component <router-link> should be used for
     * intern links. Components itself check, if router is installed.
     */
    router: ref<boolean>(true),
  }

  /**
   * Getter
   */
  get(key: string): any {
    if (has(this._data, key)) {
      return this._data[key].value
    }
    return null
  }

  /**
   * Getting an option as ref
   */
  ref(key: string): Ref {
    if (has(this._data, key)) {
      return toRef(this._data[key])
    }
    return ref(null)
  }

  /**
   * Setter
   */
  set(key: string, val: any): void {
    switch(key) {
      case 'host':
        if (isUrl(val)) {
          this._data.host.value = val
        }
        break
      case 'lang':
        if (isStr(val)) {
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
        }
        break
      case 'direction': {
        const direction = toKey(val)
        if (direction === 'ltr' || direction === 'rtl') {
          this._data.direction.value = val
        }
        break
      }
      case 'brand':
        if (isStr(val)) {
          this._data.brand.value = val
        }
        break
      case 'separator':
        if (isStr(val)) {
          this._data.separator.value = val
        }
        break
      case 'nl2br':
        if (isBool(val, false)) {
          this._data.nl2br.value = toBool(val)
        }
        break
      case 'date':
        if (isArr(val)) { // @TODO: check array entries
          this._data.date.value = val
        }
        break
      case 'time':
        if (isArr(val)) { // @TODO: check array entries
          this._data.time.value = val
        }
        break
      case 'router':
        if (isBool(val, false)) {
          this._data.router.value = toBool(val)
        }
        break
      default:
        if (isStr(key, 1)) {
          if (has(this._data, key)) {
            this._data[key].value = val
          } else {
            this._data[key] = ref(val)
          }
        }
    }
  }

  /**
   * Set options from object.
   */
  setOptions(obj: Object): void {
    each(obj, (val: any, key: string) => {
      this.set(key, val)
    })
  }

  /**
   * Watch a pref or an array of prefs
   */
  watch<T>(source: string|string[], callback: WatchCallback<T>, options: WatchOptions = {}): WatchStopHandle {
    if (isArr(source)) {
      const sources: Ref[] = []
      each(source, (prop: string) => {
        sources.push(this._data[prop])
      })
      return watch(sources, callback as WatchCallback, options)
    }
    return watch(this._data[source], callback as WatchCallback, options)
  }
}

/**
 * Store instance, singleton
 */
const instance: IStore = new Store()
export { instance as store }