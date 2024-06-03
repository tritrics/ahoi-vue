import { upper, each, lower, count, unique, objToParam, isStr, isObj, isUrl, isArr, isInt, isBool, toPath, toKey, toInt, toBool } from '../fn'
import { APIVERSION } from './index'
import { stores } from '../stores'
import { inject, hasAddon } from '../addons'
import type { Object, IFormParams, ApiMethods, JSONObject, ApiOrder } from '../types'

/**
 * Class to handle a single request
 */
class Request {
  
  options: Object = {}

  /**
   */
  constructor(options: Object) {
    this.options = options
  }

  /**
   * Get option `host`.
   * Parameter is the fully qualified hostname followed by the api-slug
   * like set in Kirby's config.
   */
  get host(): string|null {
    let res: string|null = null
    if (isUrl(this.options.host)) {
      res = this.options.host
    } else if (isUrl(stores.options.get('host'))) {
      res = stores.options.get('host')
    }
    if (isStr(res) && res.endsWith('/')) {
      res = res.substring(0, res.length - 1)
    }
    return res
  }
  
  /**
   * Get option `lang`.
   * Parameter must be a valid 2-char language code.
   */
  get lang(): string|null {
    if (stores.options.get('multilang')) {
      if (isStr(this.options.lang, 1)) {
        return toKey(this.options.lang)
      } else if (isStr(stores.options.get('lang'), 1)) {
        return toKey(stores.options.get('lang'))
      }
    }
    return null
  }

  /**
   * Get option `fields`.
   * Fields can be array with single fieldnames or subarray:
   * this.options.fields = [ field1, field2, [field3, field4]]
   */
  get fields(): string[] {
    const fields: string[] = []
    if (isArr(this.options.fields)) {
      each (this.options.fields, (arg: any) => {
        each(isArr(arg) ? arg : [ arg ], (field: any) => {
          if (isStr(field, 1)) {
            fields.push(lower(field))
          }
        })
      })
    }
    return unique(fields)
  }

  /**
   * Get option `limit`.
   * Used in API request pages() to limit the number of returned pages.
   */
  get limit(): number {
    if (isInt(this.options.limit, 1)) {
      return toInt(this.options.limit)
    }
    return 10
  }

  /**
   * Get option `set`.
   * Used in API request pages() to get a specified result set in combination with limit.
   */
  get set(): number {
    if (isInt(this.options.set, 1)) {
      return toInt(this.options.set)
    }
    return 1
  }

  /**
   * Get option `order`.
   * Used in API request pages() sort the returned pages ascending or descending.
   */
  get order(): ApiOrder {
    let res: string = ''
    if (isStr(this.options.order)) {
      res = toKey(this.options.order)
    }
    return res === 'desc' ? 'desc' : 'asc'
  }

  /**
   * Get option `raw`.
   * Override core-plugin if existing for this request.
   * Can only be set to true, if site plugin exists.
   */
  get raw(): boolean {
    if (hasAddon('site')) {
      return isBool(this.options.raw) ? toBool(this.options.raw) : false
    }
    return true
  }

  /**
   * Call API interface /info.
   */
  async getInfo(): Promise<JSONObject> {
    const url: string = this.getUrl(
      this.host,
      APIVERSION,
      'info'
    )
    const res: JSONObject = await this.apiRequest(url)
    return this.convertResponse(res)
  }

  /**
   * Call API interface /language/(:any).
   */
  async getLanguage(): Promise<JSONObject> {
    const url: string = this.getUrl(
      this.host,
      APIVERSION,
      'language',
      this.lang
    )
    const res: JSONObject = await this.apiRequest(url)
    return this.convertResponse(res)
  }

  /**
   * Call API interface /page/(:all?).
   */
  async getFields(path: string): Promise<JSONObject> {
    const url: string = this.getUrl(
      this.host,
      APIVERSION,
      'fields',
      this.lang,
      path
    )
    const data: IFormParams = {}
    if (count(this.fields) > 0) {
      data.fields = this.fields
    }
    const res: JSONObject = await this.apiRequest(url, 'GET', data)
    return this.convertResponse(res)
  }

  /**
   * Call API interface /pages/(:all?).
   */
  async getPages(path: string): Promise<JSONObject> {
    return this.getCollection('pages', path)
  }

  /**
   * Call API interface /files/(:all?).
   */
  async getFiles(path: string): Promise<JSONObject> {
    return this.getCollection('files', path)
  }

  /**
   * getPages and getFiles are identical
   */
  async getCollection(node: 'pages'|'files', path: string): Promise<JSONObject> {
    const url: string = this.getUrl(
      this.host,
      APIVERSION,
      node,
      this.lang,
      path
    )
    const data: IFormParams = {
      set: this.set,
      limit: this.limit,
      order: this.order,
    }
    if (count(this.fields) > 0) {
      data.fields = this.fields
    }
    const res: JSONObject = await this.apiRequest(url, 'GET', data)
    return this.convertResponse(res)
  }

  /**
   * Post data to a specified action /action/(:any).
   */
  async postCreate(action: string, data: IFormParams): Promise<JSONObject> {

    // get token
    const urlToken: string = this.getUrl(
      this.host,
      APIVERSION,
      'token',
      this.lang,
      action
    )
    const resToken: JSONObject = await this.apiRequest(urlToken)

    // submit
    const url: string = this.getUrl(
      this.host,
      APIVERSION,
      'action',
      this.lang,
      action,
      resToken.body.token as string
    )
    return await this.apiRequest(url, 'POST', data)
  }

  /**
   * Generic API-request
   * 
   * @param {string} path
   * @param {object} data post-data
   * @returns {object} json
   */
  async call(
    path: string,
    method: ApiMethods = 'GET',
    data: IFormParams|null = null
  ): Promise<Object>
  {
    const url: string = this.getUrl(
      this.host,
      APIVERSION,
      path
    )
    return await this.apiRequest(url, method, data)
  }

  /**
   * Helper to build an URL from multiple parts.
   */
  getUrl(...args: (string|null)[]): string {
    const res = toPath(...args)
    if (!isUrl(res)) {
      throw new Error('No host defined for Api request')
    }
    return res
  }

  /**
   * Parse response, if core plugin is installed.
   */
  convertResponse(json: JSONObject): JSONObject {
    if (this.raw) {
      return json
    }
    const fn = inject('site', 'convertResponse', (json: JSONObject): JSONObject => json)
    return fn(json)
  }

  /**
   * Send API request and receive response.
   * 
   * @param {string} url 
   * @param {string} method GET, POST, PUT, DELETE
   * @param {object} data optional data, converts to post data or get-params
   * @returns {object} json, parsed if core-plugin is installed
   * @throws Error
   */
  async apiRequest(
    url: string, method:
    ApiMethods = 'GET',
    data: Object|null = null)
  : Promise<JSONObject>
  {
    const options: Object = {
      method: upper(method),
      mode: 'cors',
      cache:'no-cache',
    }
    if (isObj(data)) {
      if (method === 'GET') {
        url = `${url}${objToParam(data)}`
      } else {
        options.headers = { 'content-type': 'application/json' }
        options.body = JSON.stringify(data)
      }
    }
    const response = await fetch(url, options)
    const json: JSONObject = await response.json()
    if (!response.ok || !json.ok) {
      const msg = json.msg || response.status
      const status = json.status || response.statusText
      const out = `API reports an error while requesting ${url}: ${msg} (Error ${status})`
      console.error(out)
      throw new Error(out)
    }
    return json
  }
}

export default Request
