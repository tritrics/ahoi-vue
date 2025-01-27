import { each, count, has, trim, lower, regEsc, rtrim, unique, isUrl, isArr, isBool, isStr, isObj, isEmpty, isLocale, toBool, isUndef, isTrue, toLocale, toKey } from '../../utils'
import ImmutableStore from './ImmutableStore'
import { inject } from '../index'
import type { Object, IMainStore, II18nStore, ITemplateStore } from '../../types'

/**
 * Store with plugin and addons options.
 */
class MainStore extends ImmutableStore implements IMainStore {

  /**
   * Intern lookup map with meta-values of languages
   * {
   *   [lang] => { meta... }
   * }
   */
  #langmap: Object = {}

  /**
   * does languages in #langmap have unique urls?
   */
  #uniqueLangUrls: boolean = false

  /**
   * The best language
   */
  #detectedLang: string|null = null

  /**
   * The user prefered language
   */
  #userLang: string|null = null

  /** */
  constructor(setupOptions: Object) {
    super({
      addons: {}, // config objects for addons
      date: { year: 'numeric', month: 'numeric', day: 'numeric' },
      direction: 'ltr',
      home: 'home',
      error: 'error', // route (not blueprint)
      host: null,
      lang: null, // selected lang in a multilang enviroment, null on default and in nolang enviroments!
      langdetect: true, // user setting, if detected language should be automatically selected
      languages: [],
      locale: 'en-EN',
      multilang: false, // autoset with languages
      nl2br: false,
      router: false,
      time: { hour: '2-digit', minute: '2-digit' },
    })

    // get user-values from options
    if (setupOptions?.lang && isStr(setupOptions.lang, 2, 2)) {
      this.#userLang = toKey(setupOptions.lang)
    }
    this._setDate(setupOptions?.date)
    this._setDirection(setupOptions?.direction)
    this._setHome(setupOptions?.home)
    this._setHost(setupOptions?.host)
    this._setError(setupOptions?.error)
    this._setLangdetect(setupOptions?.langdetect)
    this._setLocale(setupOptions?.locale)
    this._setNl2br(setupOptions?.nl2br)
    this._setRouter(setupOptions?.router)
    this._setTime(setupOptions?.time)
    this._setAddons(setupOptions?.addons) // after _setRouter

    // init routines
    this.#detectLanguage()
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
    const lang: string = this.get('lang')
    path = path.replace(this.#langmap[lang]['reg'], '/')
    return rtrim(`/${lang}${path === '/' ? home : path}`, '/')
  }

  /**
   * Get the home slug for a given, selected or detected language.
   */
  getHomeSlug(lang?: string): string {
    if (this.isFalse('multilang')) {
      return '/'
    }
    if (isStr(lang, 1)) {
      return this.isValidLang(lang) ? this.#langmap[lang].node : ''
    }
    const selected = this.get('lang')
    if (this.isValidLang(selected)) {
      return this.#langmap[selected].node
    }
    if (this.#detectedLang !== null && this.isValidLang(this.#detectedLang)) {
      return this.#langmap[this.#detectedLang].node
    }
    return ''
  }

  /**
   * Check if router definition is set
   * (router can be false, true or configuration object)
   */
  hasRouter(): boolean {
    return !this.isFalse('router')
  }

  /**
   * Check, if the given language is valid in multilang-enviroment
   */
  isValidLang(lang: string|null|undefined): boolean {
    if (this.isFalse('multilang')) {
      return isEmpty(lang)
    }
    return isStr(lang, 1) && has(this.#langmap, lang)
  }

  /**
   * Check, if given language is the currently selected.
   */
  isCurrentLang(lang: string): boolean {
    return isStr(lang, 1) && this.is('lang', lang)
  }

  /**
   * Setting lang from detected lang.
   */
  setLangFromDetected(): void {
    if (this.isTrue('multilang')) {
      this._setLang(this.#detectedLang)
    }
  }

  /**
   * Detect and set language from url. Sets detected lang, if
   * url detection fails and no lang was set before.
   */
  setLangFromUrl(url?: string): boolean {
    if (this.isTrue('multilang')) {
      const currentLang = this.get('lang')
      if (this.#uniqueLangUrls) {
        const lang = this._getLangFromUrl(url ?? window.location.href)
        if (this.isValidLang(lang) && this.isNot('lang', lang)) {
          this._setLang(lang)
        }
      }
      if (!this.isValidLang(this.get('lang'))) {
        this.setLangFromDetected()
      }
      return currentLang !== this.get('lang')
    }
    return false
  }

  /**
   * Update Stores with mainStore data in cases, where watch() doesn't work, because
   * result must be awaited to continue with parent procedure.
   */
  async updateStores(): Promise<void> {
    const promises: Promise<void>[] = []
    const lang = this.get('lang')
    if (inject('template')) {
      const templateStore = inject('template', 'store') as ITemplateStore
      promises.push(templateStore.loadSite(lang))
      promises.push(templateStore.loadHome(lang))
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
    for(const lang in this.#langmap) {
      if (!this.#langmap[lang]['reg'].test(url.pathname)) {
        continue
      }
      if (isStr(this.#langmap[lang].origin, 1)) {
        if (this.#langmap[lang].origin === lower(url.origin)) {
          return lang
        } else if (isStr(this.#langmap[lang].node, 1)) {
          return lang
        }
      } else {
        if (isStr(this.#langmap[lang].node, 1)) {
          return lang
        }
        res = lang
      }
    }
    return res
  }

  /**
   * Set all addons-settings. No checks.
   */
  _setAddons(val: any): void {
    if (isObj(val)) {
      this._set('addons', val)
      if (has(val, 'router') && isObj(val.router)) {
        this._setRouter(true)
      }
    }
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
   * The error-slug (not path) like optionally defined in Kirby's config.php.
   */
  _setError(val: any): void {
    if (isStr(val, 1)) {
      this._set('error', trim(val, '/'))
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
   * User-setting, if language should be automatically detected in multilanguage enviroments.
   */
  _setLangdetect(val: any): void {
    if (isBool(val, false)) {
      this._set('langdetect', toBool(val))
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

    // setting intern language data
    this.#langmap = {}
    const urls: string[] = []
    each(languages, (language: Object) => {
      const lang = toKey(language.meta.lang)
      this.#langmap[lang] = language.meta

      // normalize values
      this.#langmap[lang].origin = lower(this.#langmap[lang].origin)

      // RegExp is used to analyse paths
      let node = '/' + trim(language.meta.node, '/') + '/'
      node = node === '//' ? '/' : node
      this.#langmap[lang]['reg'] = new RegExp(`^${regEsc(node)}`)

      // Combination of origin and slug must be unique to enable
      // language detection.
      urls.push(`${language.meta.origin}${language.meta.node}`)
    })
    this.#uniqueLangUrls = count(urls) > 1 && count(urls) === count(unique(urls))
    this.#detectLanguage()
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
   * Router-flag is required, if the router-addon is NOT used, but
   * links should be converted to router-links anyway. If the router-addon
   * is used, this flag is set to true.
   */
  _setRouter(val: any): void {
    if (isBool(val, false)) {
      this._set('router', toBool(val))
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

  /**
   * Detect the best language and store in #detectLang. Language is
   * just detected and not used right away.
   */
  #detectLanguage(): void {

    // 1. from given (user-option)
    const userLang: string|null = this.#userLang
    if (
      (this.isFalse('multilang') && isStr(userLang, 2, 2)) ||
      this.isValidLang(userLang)
    ) {
      this.#detectedLang = userLang
      return
    }

    // 2. from browser
    for (let i = 0; i < navigator.languages.length; i++) {
      const navLang: string|undefined = navigator.languages[i].toLowerCase().split('-').shift()
      if (!isUndef(navLang) && this.isValidLang(navLang)) {
        this.#detectedLang = navLang
        return
      }
    }
    
    if (this.isFalse('multilang')) {
      return
    }

    // 3. default lang like defined in Kirby
    for(const lang in this.#langmap) {
      if (isTrue(this.#langmap[lang].default)) {
        this.#detectedLang = lang
        return
      }
    }

    // 4. first lang
    const firstLang = Object.keys(this.#langmap).shift()
    if (isStr(firstLang, 2, 2)) {
      this.#detectedLang = firstLang
    }
  }
}

export default MainStore