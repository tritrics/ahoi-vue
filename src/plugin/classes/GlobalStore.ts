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
   * Setter
   */
  async set(key: string, val?: any): Promise<void> {
    switch(key) {
      case 'date':
        if (isObj(val)) { // @TODO: check array entries
          super.set('date', val)
        }
        break
      case 'direction': {
        const direction = toKey(val)
        if (direction === 'ltr' || direction === 'rtl') {
          super.set('direction', val)
        }
        break
      }
      case 'home':
        if (isStr(val, 1)) {
          super.set('home', `/${trim(val, '/')}`)
        }
        break
      case 'host':
        if (isUrl(val)) {
          super.set('host', val)
        }
        break
      case 'lang': {
        const lang = toKey(val)
        if (this.isValidLang(lang)) {
          super.set('lang', lang)
          this.set('locale', this.#langmap[lang].locale)
          this.set('direction', this.#langmap[lang].direction)
        }
        break
      }
      case 'languages': {
        const multilang: boolean = isArr(val) && count(val) > 0
        const languages: Object = multilang ? val : {}
        super.set('languages', languages)
        super.set('multilang', multilang)
        this.#initLanguages()
        break
      }
      case 'locale':
        if (isLocale(val, false)) {
          super.set('locale', toLocale(val, '-'))
        }
        break
      case 'nl2br':
        if (isBool(val, false)) {
          super.set('nl2br', toBool(val))
        }
        break
      case 'router':
        if (isBool(val, false)) {
          super.set('router', toBool(val))
        }
        break
      case 'time':
        if (isArr(val)) { // @TODO: check array entries
          super.set('time', val)
        }
        break
    }
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
    console.log('getNodeFromPath', code, val)
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
   * Initializing languages, set langmap and langdetect
   */
  #initLanguages(): void {
    this.#langmap = {}
    this.#langdetect = false
    const urls: string[] = []
    each(this.get('languages'), (language: Object) => {
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
}

export default GlobalStore