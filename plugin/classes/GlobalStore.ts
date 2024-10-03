import { each, count, has, trim, lower, regEsc, rtrim, unique, isUrl, isArr, isBool, isStr, isObj, isEmpty, isLocale, toBool, isUndef, isTrue, toLocale, toKey } from '../../utils'
import ImmutableStore from './ImmutableStore'
import { optionsStore, inject } from '../index'
import type { Object, IGlobalStore, II18nStore, ISiteStore } from '../../types'

/**
 * Store with plugin and addons options.
 */
class GlobalStore extends ImmutableStore implements IGlobalStore {

  /**
   * Intern lookup map with meta-values of languages
   * {
   *   [lancode] => { meta... }
   * }
   */
  #langmap: Object = {}

  /** */
  constructor() {
    super({
      date: { year: 'numeric', month: 'numeric', day: 'numeric' },
      detected: false, // lang detected 
      direction: 'ltr',
      home: 'home',
      host: null,
      lang: null, // selected lang in a multilang enviroment, null on default and in nolang enviroments!
      languages: [],
      locale: 'en-EN',
      multilang: false, // autoset with languages
      nl2br: false,
      router: false,
      time: { hour: '2-digit', minute: '2-digit' }
    })

    // get user-values from options
    this._setDate(optionsStore.get('date'))
    this._setDirection(optionsStore.get('direction'))
    this._setHome(optionsStore.get('home'))
    this._setHost(optionsStore.get('host'))
    this._setDetected(optionsStore.get('lang'))
    this._setLocale(optionsStore.get('locale'))
    this._setNl2br(optionsStore.get('nl2br'))
    this._setRouter(optionsStore.get('router'))
    this._setTime(optionsStore.get('time'))
  }

  /**
   * In a multilang enviroment, the path of a page may be different from
   * the node, due to Kirby's language setting "url". Here we replace or
   * prepend the language slug to the beginning of the path.
   * (Language must be set before.)
   */
  getNodeFromPath(val: string): string {

    // normalize path and home to /foo/bar/ or /
    const home = `/${this.get('home')}/`
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
    path = path.replace(this.#langmap[code]['reg'], '/')
    return rtrim(`/${code}${path === '/' ? home : path}`, '/')
  }

  /**
   * Get the home slug for a given, selected or detected language.
   */
  getHomeSlug(code?: string): string {
    if (this.isFalse('multilang')) {
      return '/'
    }
    if (isStr(code, 1)) {
      return this.isValidLang(code) ? this.#langmap[code].slug : ''
    }
    const selected = this.get('lang')
    if (this.isValidLang(selected)) {
      return this.#langmap[selected].slug
    }
    const detected = this.get('detected')
    if (this.isValidLang(detected)) {
      return this.#langmap[detected].slug
    }
    return ''
  }

  /**
   * Check, if the given language is valid in multilang-enviroment
   */
  isValidLang(code: string|null|undefined): boolean {
    if (this.isFalse('multilang')) {
      return isEmpty(code)
    }
    return isStr(code, 1) && has(this.#langmap, code)
  }

  /**
   * Check, if given language is the currently selected.
   */
  isCurrentLang(code: string): boolean {
    return isStr(code, 1) && this.is('lang', code)
  }

  /**
   * Setting lang from detected lang.
   */
  setLangFromDetected(): void {
    if (this.isTrue('multilang')) {
      this._setLang(this.get('detected'))
    }
  }

  /**
   * Detect and set language from url. Sets detected lang, if
   * url detection fails and no lang was set before.
   */
  setLangFromUrl(url?: string): void {
    if (this.isTrue('multilang')) {
      if (this.isTrue('langdetect')) {
        const code = this._getLangFromUrl(url ?? window.location.href)
        if (this.isValidLang(code) && this.isNot('lang', code)) {
          this._setLang(code)
        }
      }
      if (!this.isValidLang(this.get('lang'))) {
        this.setLangFromDetected()
      }
    }
  }

  /**
   * Update Stores with globalStore data in cases, where watch() doesn't work, because
   * result must be awaited to continue with parent procedure.
   */
  async updateStores(): Promise<void> {
    const promises: Promise<void>[] = []
    const lang = this.get('lang')
    if (inject('site')) {
      const siteStore = inject('site', 'store') as ISiteStore
      promises.push(siteStore.loadSite(lang))
      promises.push(siteStore.loadHome(lang))
    }
    if (inject('i18n')) {
      const i18nStore = inject('i18n', 'store') as II18nStore
      promises.push(i18nStore.load(lang))
    }
    await Promise.all(promises)
  }

  /**
   * Detect language from url
   */
  _getLangFromUrl(href: string): string {
    let res: string = ''
    const url = new URL(`${rtrim(href, '/')}/`)
    for(const code in this.#langmap) {
      if (!this.#langmap[code]['reg'].test(url.pathname)) {
        continue
      }
      if (isStr(this.#langmap[code].origin, 1)) {
        if (this.#langmap[code].origin === lower(url.origin)) {
          return code
        } else if (isStr(this.#langmap[code].slug, 1)) {
          return code
        }
      } else {
        if (isStr(this.#langmap[code].slug, 1)) {
          return code
        }
        res = code
      }
    }
    return res
  }

  /**
   * Setter for date settings
   * Options for printing out date values
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString
   */
  _setDate(val: any): void {
    if (isObj(val)) { // @TODO: check array entries
      this._set('date', val)
    }
  }

  /**
   * Default language is the best language computed from user-option,
   * browser language and default language. Can differ from lang, which
   * may change in runtime.
   */
  _setDetected(val: any): void {

    // 1. from given (user-option)
    const userLang: string = toKey(val)
    if (
      (this.isFalse('multilang') && isStr(userLang, 2, 2)) ||
      this.isValidLang(userLang)
    ) {
      return this._set('detected', userLang)
    }

    // 2. from browser
    for (let i = 0; i < navigator.languages.length; i++) {
      const navLang: string|undefined = navigator.languages[i].toLowerCase().split('-').shift()
      if (!isUndef(navLang) && this.isValidLang(navLang)) {
        return this._set('detected', navLang)
      }
    }
    
    if (this.isFalse('multilang')) {
      return
    }

    // 3. default lang like defined in Kirby
    for(const lang in this.#langmap) {
      if (isTrue(this.#langmap[lang].default)) {
        return this._set('detected', lang)
      }
    }

    // 4. first lang
    this._set('detected', Object.keys(this.#langmap).shift())
  }

  /**
   * Setter for language direction
   * Reading direction of language
   * ltr = left to right
   * rtl = right to left
   */
  _setDirection(val: any): void {
    const direction = toKey(val)
    if (direction === 'ltr' || direction === 'rtl') {
      this._set('direction', val)
    }
  }

  /**
   * Setter for home-slug
   * The home-slug (not path) like optionally defined in Kirby's config.php.
   * The href to homepage is '/' and this slug is needed to compute the
   * corresponding node.
   */
  _setHome(val: any): void {
    if (isStr(val, 1)) {
      this._set('home', trim(val, '/'))
    }
  }

  /**
   * Setter for host url
   * The host url of the API, including path like
   * https://domain.com/public-api
   * but without version, which is automatically taken from ./index
   */
  _setHost(val: any): void {
    if (isUrl(val)) {
      this._set('host', val)
    }
  }

  /**
   * Setter for lang-code
   * Can only be set in a multilang-enviroment. In a singlelang-enviroment the
   * lang code remains an empty string.
   */
  _setLang(val: any): void {
    const lang = toKey(val)
    if (this.isNot('lang', lang) && this.isTrue('multilang') && this.isValidLang(lang)) {
      this._setLocale(this.#langmap[lang].locale)
      this._setDirection(this.#langmap[lang].direction)
      this._set('lang', lang)
    }
  }

  /**
   * Setter for languages and multilang
   * Languages: List with all available languages.
   * { code: meta }
   * Multilang: Flag to determine, if this is a multilanguage installation and
   * langcode must be added to API requests.
   */
  _setLanguages(val: any): void {
    const multilang: boolean = isArr(val) && count(val) > 0
    const languages: Object[] = multilang ? val : {}
    this._set('languages', languages)
    this._set('multilang', multilang)
    this.#langmap = {}
    const urls: string[] = []
    each(languages, (language: Object) => {
      const code = toKey(language.meta.code)
      this.#langmap[code] = language.meta

      // normalize values
      this.#langmap[code].origin = lower(this.#langmap[code].origin)

      // RegExp is used to analyse paths
      let slug = '/' + trim(language.meta.slug, '/') + '/'
      slug = slug === '//' ? '/' : slug
      this.#langmap[code]['reg'] = new RegExp(`^${regEsc(slug)}`)

      // Combination of origin and slug must be unique to enable
      // language detection.
      urls.push(`${language.meta.origin}${language.meta.slug}`)
    })
    this._set('langdetect', count(urls) > 1 && count(urls) === count(unique(urls)))
    this._setDetected(optionsStore.get('lang'))
  }

  /**
   * Setter for locale
   * Locale in the format with -, used in <meta> and for printing
   * out date, time and numbers.
   */
  _setLocale(val: any): void {
    if (isLocale(val, false)) {
      this._set('locale', toLocale(val, '-'))
    }
  }

  /**
   * Setter for nl2br
   * Print textfields with linebreaks or <br />
   */
  _setNl2br(val: any): void {
    if (isBool(val, false)) {
      this._set('nl2br', toBool(val))
    }
  }

  /**
   * Setter for router
   * Flag to determine, if component <router-link> should be used for
   * intern links.
   */
  _setRouter(val: any): void {
    if (isBool(val, false)) {
      this._set('router', toBool(val))
    } else if (isObj(val) && has(val, 'type')) {
      this._set('router', true)
    }
  }

  /**
   * Setter for time settings
   * Options for printing out time values
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleTimeString
   */
  _setTime(val: any): void {
    if (isArr(val)) { // @TODO: check array entries
      this._set('time', val)
    }
  }
}

export default GlobalStore