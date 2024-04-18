import { APIVERSION } from './index'
import { each, has, toKey, lower, isArr, isTrue, isInt, isObj, isStr, isUrl, isBool, toBool, toInt } from '../fn'
import { hasPlugin } from '../plugins'
import type { ApiRequestParams, ApiOrder } from '../types'

/**
 * Options for an API request
 */
class Options {

  /**
   * Default options
   */
  params: ApiRequestParams = {
    host: null,
    lang:  null,
    fields: true, // true = all fields, false = no fields, array with field names
    limit: 10,
    set: 1,
    order: 'asc',
    raw: false, // is set to true if parser exists
    multilang: true, // multilang is only set to false by i18n-plugin
  }

  /**
   */
  constructor(params: ApiRequestParams = {}) {
    if (!has(params, 'raw') || !isBool(params.raw)) {
      params.raw = hasPlugin('parser')
    }
    this.set(params)
  }

  /**
   * Create a new Options instance and merge optionally given params.
   */
  clone(params: ApiRequestParams, reset: boolean = false): Options {
    const clone: Options = new Options()
    if (!reset) {
      clone.set(structuredClone(this.params))
    }
    clone.set(params)
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
    return this.params.host!
  }

  /**
   * @see setter
   * Optionally overwrite it with the prefered language.
   */
  getLang(langPrefered: string|null = null): string|null {
    if (!this.params.multilang) {
      return null
    }
    return isStr(langPrefered, 1) ? langPrefered : this.params.lang!
  }

  /**
   * @see setter
   */
  getFields(): string[]|boolean {
    return this.params.fields!
  }

  /**
   * Getter for fields for use in request, where true translates to 'all'
   */
  getFieldsRequest(): string[]|'all' {
    if (isTrue(this.params.fields)) {
      return 'all'
    } else if (isArr(this.params.fields)) {
      return this.params.fields
    }
    return []
  }

  /**
   * @see setter
   */
  getLimit(): number {
    return this.params.limit!
  }

  /**
   * @see setter
   */
  getSet(): number {
    return this.params.set!
  }

  /**
   * @see setter
   */
  getOrder(): ApiOrder {
    return this.params.order!
  }

  /**
   * @see setter
   */
  getRaw(): boolean {
    return this.params.raw!
  }

  /**
   * Set multiple options at once.
   */
  set(params: ApiRequestParams): void {
    if (!isObj(params)) {
      return
    }
    each(params, (val: any, prop: string) => {
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
        this.params.host = host.substring(0, host.length - 1)
      } else {
        this.params.host = host
      }
    }
  }

  /**
   * Set option `lang`.
   * Parameter must be a valid 2-char language code.
   */
  setLang(lang: string): void {
    if (isStr(lang)) {
      this.params.lang = toKey(lang)
    } else {
      this.params.lang = null
    }
  }

  /**
   * Set option `fields`. Given parameter can be:
   * - setFields(true) to request all fields
   * - setFields(false) to request no fields
   * - one or multiple strings with fieldnames or array with fieldnames
   *   setFields('field1', 'field2', 'field3', ['field4', 'field5', 'field6'])
   */
  setFields(...args: (string|string[])[]|[boolean]): void {
    if (args.length === 1 && isBool(args[0])) {
      this.params.fields = toBool(args[0])
      return
    }
    const fields: string[] = []
    each (args, (arg: any) => {
      each(isArr(arg) ? arg : [ arg ], (field: any) => {
        if (isStr(field, 1)) {
          fields.push(lower(field))
        }
      })
    })
    this.params.fields = fields
  }

  /**
   * Set option `limit`.
   * Used in API request pages() to limit the number of returned pages.
   */
  setLimit(limit: number): void {
    if (isInt(limit, 1)) {
      this.params.limit = toInt(limit)
    }
  }

  /**
   * Set option `set`.
   * Used in API request pages() to get a specified result set in combination with limit.
   */
  setSet(no: number): void {
    if (isInt(no, 1)) {
      this.params.set = toInt(no)
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
        this.params.order = val
      }
    }
  }

  /**
   * Set option `raw`.
   * Override parser-plugin if existing for this request.
   * Can only be set to true, if parser plugin exists.
   */
  setRaw(raw: boolean = true): void {
    this.params.raw = isTrue(raw) && hasPlugin('parser')
  }

  /**
   * Set option `multilang`.
   * In multilang-sites the lang-code is added to the request url.
   * 
   * @param {boolean} isMultilang 
   */
  setMultilang(isMultilang: boolean): void {
    this.params.multilang = toBool(isMultilang)
  }
}

export default Options
