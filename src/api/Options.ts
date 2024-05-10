import { APIVERSION } from './index'
import { each, has, count, toKey, lower, isArr, isTrue, isInt, isObj, isStr, isUrl, isBool, toBool, toInt } from '../fn'
import { hasPlugin } from './plugins'
import type { IApiRequestOptionsAll, IApiRequestOptions, ApiOrder } from '../types'

/**
 * Options for an API request
 */
class Options {

  /**
   * Default options
   */
  options: IApiRequestOptionsAll = {
    host: null,
    lang:  null,
    fields: [],
    limit: 10,
    set: 1,
    order: 'asc',
    raw: false, // is set to true if core exists
    multilang: true, // multilang is only set to false by i18n-plugin
  }

  /**
   */
  constructor(options: IApiRequestOptions = {}) {
    if (!has(options, 'raw') || !isBool(options.raw)) {
      options.raw = hasPlugin('site')
    }
    this.set(options)
  }

  /**
   * Create a new Options instance and merge optionally given options.
   */
  clone(options: IApiRequestOptions, reset: boolean = false): Options {
    const clone: Options = new Options()
    if (!reset) {
      clone.set(structuredClone(this.options))
    }
    clone.set(options)
    return clone
  }

  /**
   * Get the API Version (like v1).
   */
  getVersion(): string {
    return APIVERSION
  }

  /**
   * @see setter
   */
  getHost(): string|null {
    return this.options.host
  }

  /**
   * @see setter
   * Optionally overwrite it with the prefered language.
   */
  getLang(langPrefered: string|null = null): string|null {
    if (!this.options.multilang) {
      return null
    }
    return isStr(langPrefered, 1) ? langPrefered : this.options.lang!
  }

  /**
   * @see setter
   */
  getFields(): string[] {
    return this.options.fields
  }

  /**
   * @see setter
   */
  getLimit(): number {
    return this.options.limit
  }

  /**
   * @see setter
   */
  getSet(): number {
    return this.options.set
  }

  /**
   * @see setter
   */
  getOrder(): ApiOrder {
    return this.options.order
  }

  /**
   * @see setter
   */
  getRaw(): boolean {
    return this.options.raw
  }

  /**
   * Is the request limited to certain fields?
   */
  hasFields(): boolean {
    return count(this.options.fields) > 0
  }

  /**
   * Set multiple options at once.
   */
  set(options: IApiRequestOptions): void {
    if (!isObj(options)) {
      return
    }
    each(options, (val: any, prop: string) => {
      switch(prop) {
        case 'host':
          return this.setHost(val)
        case 'lang':
          return this.setLang(val)
        case 'fields':
          return this.setFields(val)
        case 'limit':
          return this.setLimit(val)
        case 'set':
          return this.setSet(val)
        case 'order':
          return this.setOrder(val)
        case 'raw':
          return this.setRaw(val)
      }
    })
  }

  /**
   * Set option `host`.
   * Parameter is the fully qualified hostname followed by the api-slug
   * like set in Kirby's config.
   */
  setHost(host: string): void {
    if (isUrl(host)) {
      if (host.endsWith('/')) {
        this.options.host = host.substring(0, host.length - 1)
      } else {
        this.options.host = host
      }
    }
  }

  /**
   * Set option `lang`.
   * Parameter must be a valid 2-char language code.
   */
  setLang(lang: string): void {
    if (isStr(lang)) {
      this.options.lang = toKey(lang)
    } else {
      this.options.lang = null
    }
  }

  /**
   * Set option `fields`. Given parameter can be one or multiple strings
   * with fieldnames or array with fieldnames
   * setFields('field1', 'field2', 'field3', ['field4', 'field5', 'field6'])
   */
  setFields(...args: (string|string[])[]): void {
    this.options.fields = []
    each (args, (arg: any) => {
      each(isArr(arg) ? arg : [ arg ], (field: any) => {
        if (isStr(field, 1)) {
          this.options.fields.push(lower(field))
        }
      })
    })
  }

  /**
   * Set option `limit`.
   * Used in API request pages() to limit the number of returned pages.
   */
  setLimit(limit: number): void {
    if (isInt(limit, 1)) {
      this.options.limit = toInt(limit)
    }
  }

  /**
   * Set option `set`.
   * Used in API request pages() to get a specified result set in combination with limit.
   */
  setSet(no: number): void {
    if (isInt(no, 1)) {
      this.options.set = toInt(no)
    }
  }

  /**
   * Set option `order`.
   * Used in API request pages() sort the returned pages ascending or descending.
   */
  setOrder(order: ApiOrder): void {
    if (isStr(order)) {
      const val: string = toKey(order)
      if (val === 'asc' || val === 'desc') {
        this.options.order = val
      }
    }
  }

  /**
   * Set option `raw`.
   * Override core-plugin if existing for this request.
   * Can only be set to true, if core plugin exists.
   */
  setRaw(raw: boolean = true): void {
    this.options.raw = isTrue(raw) && hasPlugin('site')
  }

  /**
   * Set option `multilang`.
   * In multilang-sites the lang-code is added to the request url.
   * 
   * @param {boolean} isMultilang 
   */
  setMultilang(isMultilang: boolean): void {
    this.options.multilang = toBool(isMultilang)
  }
}

export default Options
