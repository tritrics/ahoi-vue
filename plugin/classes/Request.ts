import { upper, each, lower, count, unique, objToParam, isStr, isObj, isUrl, isArr, isInt, isBool, toPath, toKey, toInt, toBool } from '../../fn'
import { inject, globalStore } from '../index'
import { APIVERSION } from '../index'
import type { Object, IFormParams, ApiMethods, JSONObject, ApiOrder } from '../../types'

/**
 * Class to handle a single request
 */
class Request {
  
  _options: Object = {}

  /**
   */
  constructor(options: Object) {
    this._options = options
  }

  /**
   * Get option `host`.
   * Parameter is the fully qualified hostname followed by the api-slug
   * like set in Kirby's config.
   */
  get host(): string|null {
    let res: string|null = null
    if (isUrl(this._options.host)) {
      res = this._options.host
    } else if (isUrl(globalStore.get('host'))) {
      res = globalStore.get('host')
    }
    if (isStr(res) && res.endsWith('/')) {
      res = res.substring(0, res.length - 1)
    }
    return res
  }

  /**
   * Get option `fields`.
   * Fields can be array with single fieldnames or subarray:
   * this.options.fields = [ field1, field2, [field3, field4]]
   * If fields is empty array, all fields are returned.
   */
  get fields(): string[] {
    const fields: string[] = []
    if (isArr(this._options.fields)) {
      each (this._options.fields, (arg: any) => {
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
    if (isInt(this._options.limit, 1)) {
      return toInt(this._options.limit)
    }
    return 10
  }

  /**
   * Get option `set`.
   * Used in API request pages() to get a specified result set in combination with limit.
   */
  get set(): number {
    if (isInt(this._options.set, 1)) {
      return toInt(this._options.set)
    }
    return 1
  }

  /**
   * Get option `order`.
   * Used in API request pages() sort the returned pages ascending or descending.
   */
  get order(): ApiOrder {
    let res: string = ''
    if (isStr(this._options.order)) {
      res = toKey(this._options.order)
    }
    return res === 'desc' ? 'desc' : 'asc'
  }

  /**
   * Get option `raw`.
   * Can only be set to true, if site plugin exists.
   */
  get raw(): boolean {
    if (inject('site')) {
      return isBool(this._options.raw) ? toBool(this._options.raw) : false
    }
    return true
  }

  get id(): string|null {
    if (isStr(this._options.id, 1)) {
      return this._options.id
    }
    return null
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
    ahoi.log('>', 'request info')
    const res: JSONObject = await this.apiRequest(url)
    ahoi.log('<', 'request info')
    return this.convertResponse(res)
  }

  /**
   * Call API interface /language/(:any).
   */
  async getLanguage(lang: string|null): Promise<JSONObject> {
    const url: string = this.getUrl(
      this.host,
      APIVERSION,
      'language',
      lang
    )
    ahoi.log('>', 'request language', lang)
    const data: IFormParams = {}
    if (this.id) {
      data.id = this.id
    }
    const res: JSONObject = await this.apiRequest(url, 'GET', data)
    ahoi.log('<', 'request language', lang)
    return this.convertResponse(res)
  }

  /**
   * getPage and getFile are identical
   */
  async getNode(node: 'page'|'file', path: string|string[]|null): Promise<JSONObject> {
    const url: string = this.getUrl(
      this.host,
      APIVERSION,
      node,
      path
    )
    ahoi.log('>', isStr(path, 2, 2) ? 'request site' : 'request ' + node, 'start', path ?? '')
    const data: IFormParams = {}
    if (count(this.fields) > 0) {
      data.fields = this.fields
    }
    if (this.id) {
      data.id = this.id
    }
    const res: JSONObject = await this.apiRequest(url, 'GET', data)
    ahoi.log('<', isStr(path, 2, 2) ? 'request site' : 'request ' + node, 'ready', path ?? '')
    return this.convertResponse(res)
  }

  /**
   * getPages and getFiles are identical
   */
  async getCollection(node: 'pages'|'files', path: string|string[]|null): Promise<JSONObject> {
    const url: string = this.getUrl(
      this.host,
      APIVERSION,
      node,
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
    if (this.id) {
      data.id = this.id
    }
    const res: JSONObject = await this.apiRequest(url, 'GET', data)
    return this.convertResponse(res)
  }

  /**
   * Post data to a specified action /action/(:any).
   */
  async postCreate(action: string|string[], data: IFormParams): Promise<JSONObject> {

    // get token
    const urlToken: string = this.getUrl(
      this.host,
      APIVERSION,
      'token',
      action
    )
    const resToken: JSONObject = await this.apiRequest(urlToken)

    // submit
    const url: string = this.getUrl(
      this.host,
      APIVERSION,
      'action',
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
  getUrl(...args: (string|string[]|null)[]): string {
    const res = toPath(args)
    if (!isUrl(res)) {
      throw new Error('No host defined for Api request')
    }
    return res
  }

  /**
   * Parse response, if core plugin is installed.
   */
  convertResponse(json: JSONObject): JSONObject {
    if (inject('site') && !this.raw) {
      const fn = inject('site', 'convertResponse') as Function
      return fn(json)
    }
    return json
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
    if (isObj(data) && count(data) > 0) {
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
