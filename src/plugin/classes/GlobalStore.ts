import { each, count, has, trim, lower, regEsc, rtrim, unique, isUrl, isArr, isBool, isStr, isObj, isLocale, toBool, isTrue, toLocale, toKey } from '../../fn'
import AddonStore from './AddonStore'
import { optionsStore } from '../index'
import type { Object, IGlobalStore } from '../../types'

/**
 * Store with plugin and addons options.
 */
class GlobalStore extends AddonStore implements IGlobalStore {

  /**
   * Flag, if language detection from url is possible. This is the case,
   * when origin + slug of all languages i unique.
   */
  #langdetect: boolean = false

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
      direction: 'ltr',
      home: '/home',
      host: '',
      lang: '',
      languages: [],
      locale: 'en-EN',
      multilang: false,
      nl2br: false,
      router: true,
      time: { hour: '2-digit', minute: '2-digit' }
    })

    // get user-values from options
    this.set('date', optionsStore.get('date'))
    this.set('direction', optionsStore.get('direction'))
    this.set('home', optionsStore.get('home'))
    this.set('host', optionsStore.get('host'))
    this.set('locale', optionsStore.get('locale'))
    this.set('nl2br', optionsStore.get('nl2br'))
    this.set('router', optionsStore.get('router'))
    this.set('time', optionsStore.get('time'))
  }

  /**
   * Get default language.
   */
  getDefaultLang(): string|null {
    if (this.isFalse('multilang')) {
      return optionsStore.get('lang')
    }
    for(const code in this.#langmap) {
      if (isTrue(this.#langmap[code].default)) {
        return code
      }
    }
    return Object.keys(this.#langmap).shift() as string
  }

  /**
   * Detect language from url
   */
  getLangFromUrl(href?: string): string|null {
    if (!this.#langdetect) {
      return null
    }
    let res: string|null = null
    const url = new URL(href ?? window.location.href)
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
    path = path.replace(this.#langmap[code]['reg'], '/')
    return rtrim(`/${code}${path === '/' ? home : path}`, '/')
  }

  /**
   * Check, if the given language is valid.
   */
  isValidLang(code: string): boolean {
    return isStr(code, 1) && this.isTrue('multilang') && has(this.#langmap, code)
  }

  /**
   * Check, if given language is the currently selected.
   */
  isCurrentLang(code: string): boolean {
    return isStr(code, 1) && this.is('lang', code)
  }

  /**
   * Setter for date settings
   * Options for printing out date values
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString
   */
  _setDate(val: any): void {
    if (isObj(val)) { // @TODO: check array entries
      super._set('date', val)
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
      super._set('direction', val)
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
      super._set('home', `/${trim(val, '/')}`)
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
      super._set('host', val)
    }
  }

  /**
   * Setter for lang-code
   * The language of the current page, used in <html lang="en">
   * Empty on init, because it may be a non-multilang-site.
   * Can only be set in a multilang-enviroment.
   */
  _setLang(val: any): void {
    const lang = toKey(val)
    if (this.isValidLang(lang)) {
      this.set('locale', this.#langmap[lang].locale)
      this.set('direction', this.#langmap[lang].direction)
      super._set('lang', lang)
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
    super._set('languages', languages)
    super._set('multilang', multilang)
    this.#langmap = {}
    this.#langdetect = false
    const urls: string[] = []
    each(languages, (language: Object) => {
      const code = language.meta.code
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
    this.#langdetect = count(urls) > 1 && count(urls) === count(unique(urls))
  }

  /**
   * Setter for locale
   * Locale in the format with -, used in <meta> and for printing
   * out date, time and numbers.
   */
  _setLocale(val: any): void {
    if (isLocale(val, false)) {
      super._set('locale', toLocale(val, '-'))
    }
  }

  /**
   * Setter for nl2br
   * Print textfields with linebreaks or <br />
   */
  _setNl2br(val: any): void {
    if (isBool(val, false)) {
      super._set('nl2br', toBool(val))
    }
  }

  /**
   * Setter for router
   * Flag to determine, if component <router-link> should be used for
   * intern links. Components itself check, if router is installed.
   */
  _setRouter(val: any): void {
    if (isBool(val, false)) {
      super._set('router', toBool(val))
    }
  }

  /**
   * Setter for time settings
   * Options for printing out time values
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleTimeString
   */
  _setTime(val: any): void {
    if (isArr(val)) { // @TODO: check array entries
      super._set('time', val)
    }
  }
}

export default GlobalStore