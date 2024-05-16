import { ref, watch, toRef } from 'vue'
import { each, has, count, isUrl, isArr, isStr, isBool, isLocale, toBool, toLocale, toKey } from '../fn'
import type { Ref, WatchCallback, WatchOptions, WatchStopHandle } from 'vue'
import type { Object, DateTimeFormat } from '../types'

interface IStore {
  host: string
  lang: string
  langname: string
  locale: string
  multilang: boolean
  direction: string
  brand: string
  title: string
  keywords: string
  description: string
  image: string
  url: string
  separator: string
  nl2br: boolean
  date:DateTimeFormat
  time: DateTimeFormat
  router: boolean
  setOptions(obj: Object): void
  watch<T>(source: string|string[], callback: WatchCallback<T>, options?: WatchOptions): Function
}

/**
 * The Store
 */
class Store implements IStore {

  /**
   * The build in preferences
   */
  _options: Object = {

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
     * The name of the language.
     */
    langname: ref<string>('English'),

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
     * Title of the page (= page title)
     */
    title: ref<string>('Home'),

    /**
     * Meta tag keywords
     */
    keywords: ref<string>(''),

    /**
     * Meta tag description.
     */
    description: ref<string>(''),

    /**
     * Meta tag image url (of the current page).
     */
    image: ref<string>(''),

    /**
     * Meta tag url (of the current page).
     */
    url: ref<string>(''),

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
   * Additional data
   */
  _data: Object = {}

  /**
   * Set options from object.
   */
  setOptions(obj: Object): void {
    each(obj, (val: any, key: string) => {
      if (has(this._options, key)) {
        eval('this[key] = val')
      }
    })
  }

  /**
   * Getting an option as ref
   */
  ref(key: string): Ref {
    if (has(this._options, key)) {
      return toRef(this._options[key])
    }
    return ref(null)
  }

  /**
   * Watch a pref or an array of prefts
   */
  watch<T>(source: string|string[], callback: WatchCallback<T>, options: WatchOptions = {}): WatchStopHandle {
    if (isArr(source)) {
      const sources: Ref[] = []
      each(source, (prop: string) => {
        sources.push(this._options[prop])
      })
      return watch(sources, callback as WatchCallback, options)
    }
    return watch(this._options[source], callback as WatchCallback, options)
  }

  /**
   * Getter
   */
  get host(): string {
    return this._options.host.value
  }

  get lang(): string {
    return this._options.lang.value
  }

  get langname(): string {
    return this._options.langname.value
  }

  get locale(): string {
    return this._options.locale.value
  }

  get multilang(): boolean {
    return this._options.multilang.value
  }

  get direction(): string {
    return this._options.direction.value
  }

  get brand(): string {
    return this._options.brand.value
  }

  get title(): string {
    return this._options.title.value
  }

  get keywords(): string {
    return this._options.keywords.value
  }

  get description(): string {
    return this._options.description.value
  }

  get image(): string {
    return this._options.image.value
  }
  
  get url(): string {
    return this._options.url.value
  }

  get separator(): string {
    return this._options.separator.value
  }

  get nl2br(): boolean {
    return this._options.nl2br.value
  }

  get date(): DateTimeFormat {
    return this._options.date.value
  }

  get time(): DateTimeFormat {
    return this._options.time.value
  }

  get router(): boolean {
    return this._options.router.value
  }

  /**
   * Setter
   */
  set host(val: string) {
    if (isUrl(val)) {
      this._options.host.value = val
    }
  }

  set lang(val: string) {
    if (isStr(val)) {
      this._options.lang.value = val
    }
  }

  set langname(val: string) {
    if (isStr(val)) {
      this._options.langname.value = val
    }
  }

  set locale(val: string) {
    if (isLocale(val, false)) {
      this._options.locale.value = toLocale(val, '-')
    }
  }

  set multilang(val: boolean) {
    if (isBool(val, false)) {
      this._options.multilang.value = toBool(val)
    }
  }

  set direction(val: string) {
    const direction = toKey(val)
    if (direction === 'ltr' || direction === 'rtl') {
      this._options.direction.value = val
    }
  }

  set brand(val: string) {
    if (isStr(val)) {
      this._options.brand.value = val
    }
  }

  set title(val: string) {
    if (isStr(val)) {
      this._options.title.value = val
    }
  }

  set keywords(val: string) {
    if (isStr(val)) {
      this._options.keywords.value = val
    }
  }

  set description(val: string) {
    if (isStr(val)) {
      this._options.description.value = val
    }
  }

  set image(val: string) {
    if (isUrl(val)) {
      this._options.image.value = val
    }
  }
  
  set url(val: string) {
    if (isUrl(val)) {
      this._options.url.value = val
    }
  }

  set separator(val: string) {
    if (isStr(val)) {
      this._options.separator.value = val
    }
  }

  set nl2br(val: boolean) {
    if (isBool(val, false)) {
      this._options.nl2br.value = toBool(val)
    }
  }

  /**
   * @TODO: check array entries
   */
  set date(val: DateTimeFormat) {
    if (isArr(val)) {
      this._options.date.value = val
    }
  }

  /**
   * @TODO: check array entries
   */
  set time(val: DateTimeFormat) {
    if (isArr(val)) {
      this._options.time.value = val
    }
  }

  set router(val: boolean) {
    if (isBool(val, false)) {
      this._options.router.value = toBool(val)
    }
  }
}

/**
 * Store instance, singleton
 */
const instance: IStore = new Store()
export { instance as store }