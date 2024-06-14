
import { ref } from 'vue'
import { each, count, has, trim, lower, regEsc, rtrim, unique, isUrl, isArr, isBool, isStr, isObj, isLocale, toBool, isTrue, toLocale, toKey } from '../../fn'
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
     * The home-slug (not path) like optionally defined in Kirby's config.php.
     * The href to homepage is '/' and this slug is needed to compute the
     * corresponding node.
     */
    home: ref<string>('/home'),

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
   * Flag, if language detection from url is possible. This is the case,
   * when origin + slug of all languages i unique. Check
   */
  _langdetect: boolean = false

  /**
   * Intern lookup map with meta-values of languages
   * {
   *   [lancode] => { meta... }
   * }
   */
  _langmap: Object = {}

  /**
   * GlobalStore holds also the user options.
   */
  constructor(options: Object = {}) {
    super()
    if (isObj(options)) {
      this._options = options
      this.set('date', this._options.date ?? null)
      this.set('direction', this._options.direction ?? null)
      this.set('home', this._options.home ?? null)
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
      case 'home':
        if (isStr(val, 1)) {
          this._data.home.value = `/${trim(val, '/')}`
        }
        break
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
          this._setLanguages(val)
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
   * Get default language.
   */
  getDefaultLang(): string|null {
    if (this.isFalse('multilang')) {
      return this.getOption('lang')
    }
    for(const code in this._langmap) {
      if (isTrue(this._langmap[code].default)) {
        return code
      }
    }
    return Object.keys(this._langmap).shift() as string
  }

  /**
   * Detect language from url
   */
  getLangFromUrl(href?: string): string|null {
    if (!this._langdetect) {
      return null
    }
    let res: string|null = null
    const url = new URL(href ?? window.location.href)
    for(const code in this._langmap) {
      if (!this._langmap[code]['reg'].test(url.pathname)) {
        continue
      }
      if (isStr(this._langmap[code].origin, 1)) {
        if (this._langmap[code].origin === lower(url.origin)) {
          return code
        } else if (isStr(this._langmap[code].slug, 1)) {
          return code
        }
      } else {
        if (isStr(this._langmap[code].slug, 1)) {
          return code
        }
        res = code
      }
    }
    return res
  }

  /**
   * In a multilang enviroment, the path of a page may be different from
   * the node, due to Kirby's language setting "url". Here we replace or
   * prepend the language slug to the beginning of the path.
   */
  getNodeFromPath(val: string): string {

    // normalize path and home to /foo/bar/ or /
    const home = `${this.get('home')}/`
    let path = `/${trim(val, '/')}/`
    if (path === '//') {
      path = '/'
    }

    // singlelang
    if (this.isFalse('multilang')) {
      return rtrim(path === '/' ? home : path, '/')
    }

    // multilang, remove prefix from start and replace with lang
    const code: string = this.get('lang')
    path = path.replace(this._langmap[code]['reg'], '/')
    return rtrim(`/${code}${path === '/' ? home : path}`, '/')
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

  /**
   * Languages setter
   */
  _setLanguages(languages: Object[]): void {
    this._data.languages.value = languages

    // langmap and langdetect
    this._langmap = {}
    const urls: string[] = []
    each(languages, (language: Object) => {
      const code = language.meta.code
      this._langmap[code] = language.meta

      // normalize values
      this._langmap[code].origin = lower(this._langmap[code].origin)

      // RegExp is used to analyse paths
      let slug = '/' + trim(language.meta.slug, '/') + '/'
      slug = slug === '//' ? '/' : slug
      this._langmap[code]['reg'] = new RegExp(`^${regEsc(slug)}`)

      // Combination of origin and slug must be unique to enable
      // language detection.
      urls.push(`${language.meta.origin}${language.meta.slug}`)
    })
    this._langdetect = count(urls) === count(unique(urls))
  }
}

export default GlobalStore