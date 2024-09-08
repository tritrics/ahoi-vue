import { upper, each, count, unique, objToParam, inArr, isStr, isObj, isUrl, isArr, isNum, isInt, isBool, toPath, toKey, toInt, toBool } from '../../fn'
import { inject, globalStore } from '../index'
import debug from '../modules/debug'
import { APIVERSION } from '../index'
import type { Object, IApiRequestOptions, ApiMethods, ApiPagesStatus, JSONObject } from '../../types'

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
            fields.push(toKey(field))
          }
        })
      })
    }
    return unique(fields)
  }

  /**
   * Get option `filter`.
   * Filter uses the same syntax like Kirby:
   * 
   * https://getkirby.com/docs/reference/objects/cms/pages/filter-by
   * https://getkirby.com/docs/cookbook/collections/filtering
   * 
   * f.ex.:
   * 
   * filter: [ 'title', '==', 'foo'] or multidimensional:
   * filter: [
   *   [ 'title', '==', 'foo'],
   *   [ 'created', 'date >', '2024-08-06' ]
   * ]
   */
  get filter(): any[] {
    if (isArr(this._options.filter)) {
      return this.#arrToParam(this._options.filter)
    }
    return []
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

  get id(): string|null {
    if (isStr(this._options.id, 1)) {
      return this._options.id
    }
    return null
  }

  /**
   * Get option `limit`.
   * Used in API request pages() to limit the number of returned pages.
   */
  get limit(): number {
    if (isInt(this._options.limit, 1)) {
      return toInt(this._options.limit)
    }
    return 0
  }

  /**
   * Get option `offset`.
   * Used in API request pages() to get a specified result set in combination with limit.
   */
  get offset(): number {
    if (isInt(this._options.offset, 1)) {
      return toInt(this._options.offset)
    }
    return 0
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

  /**
   * Get option `order`.
   * Used in API request pages() sort the returned pages ascending or descending.
   */
  get sort(): string[] {
    if (isArr(this._options.sort)) {
      return this.#arrToParam(this._options.sort)
    }
    return []
  }

  /**
   * Get option `status`
   * Status of pages in collection request. Can be listed, unlisted or
   * published (= listed or unlisted).
   */
  get status(): ApiPagesStatus|null {
    if (isStr(this._options.status)) {
      const status: string = toKey(this._options.status)
      if (inArr(status, ['listed', 'unlisted', 'published'])) {
        return status as ApiPagesStatus
      }
    }
    return null
  }

  /**
   * Call API interface /info.
   */
  async getInfo(): Promise<JSONObject> {
    debug.verbose('>', 'getInfo()')
    const res: JSONObject = await this.#apiRequest(
      this.#getUrl(this.host, APIVERSION, 'info'),
      null,
      null
    )
    return this.#convertResponse(res)
  }

  /**
   * Call API interface /language/(:any).
   */
  async getLanguage(lang: string|null): Promise<JSONObject> {
    debug.verbose('>', 'getLanguage()')
    const res = await this.#apiRequest(
      this.#getUrl(this.host, APIVERSION, 'language', lang),
      this.#getOptions('id'),
      null
    )
    return this.#convertResponse(res)
  }

  /**
   * getPage and getFile are identical
   */
  async getNode(node: 'page'|'file', path: string|string[]|null): Promise<JSONObject> {
    debug.verbose('>', 'getNode()')
    const res = await this.#apiRequest(
      this.#getUrl(this.host, APIVERSION, node, path),
      this.#getOptions('fields', 'id'),
      null
    )
    return this.#convertResponse(res)
  }

  /**
   * getPages and getFiles are identical
   */
  async getCollection(node: 'pages'|'files', path: string|string[]|null): Promise<JSONObject> {
    debug.verbose('>', 'getCollection()')
    const res = await this.#apiRequest(
      this.#getUrl(this.host, APIVERSION, node, path),
      this.#getOptions('fields', 'filter', 'id', 'limit', 'offset', 'sort', 'status'),
      null
    )
    return this.#convertResponse(res)
  }

  /**
   * Post data to a specified action /action/(:any).
   */
  async postCreate(action: string|string[], data: IApiRequestOptions): Promise<JSONObject> {
    debug.verbose('>', 'postCreate()')

    // get token
    const resToken: JSONObject = await this.#apiRequest(
      this.#getUrl(this.host, APIVERSION, 'token', action)
    )

    // submit
    return await this.#apiRequest(
      this.#getUrl(this.host, APIVERSION, 'action', action, resToken.body.token as string),
      data,
      'POST'
    )
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
  async #apiRequest(url: string, data: Object|null = null, forceMethod: ApiMethods|null = null) : Promise<JSONObject> {

    // init options
    const options: Object = {
      mode: 'cors',
      cache:'no-cache',
    }

    // check method
    if (isStr(forceMethod, 1) && inArr(upper(forceMethod), ['GET', 'POST', 'PUT', 'DELETE'])) {
      options.method = upper(forceMethod)
    } else if (isObj(data)) {
      options.method = 'POST'
    } else {
      options.method = 'GET'
    }

    // data in url or body
    if (isObj(data)) {
      if (options.method === 'GET') {
        url = `${url}${objToParam(data)}`
      } else {
        options.headers = { 'content-type': 'application/json' }
        options.body = JSON.stringify(data)
      }
    }
    debug.verbose(url)
    debug.verbose(options)
    debug.verbose(data)

    // request
    const response = await fetch(url, options)
    const json: JSONObject = await response.json()
    debug.verbose(json)
    debug.verbose('<', 'ready')

    // error
    if (!response.ok || !json.ok) {
      const msg = json.msg || response.status
      const status = json.status || response.statusText
      debug.error('error', msg, status)
      throw new Error(`AHOI Plugin: API reports an error while requesting ${url}: ${msg} (Error ${status})`)
    }

    // OK
    return json
  }

  /**
   * Helper to build an URL from multiple parts.
   */
  #getUrl(...args: (string|string[]|null)[]): string {
    const res = toPath(args)
    if (!isUrl(res)) {
      throw new Error('AHOI Plugin: No host defined for Api request')
    }
    return res
  }

  /**
   * Parse response, if core plugin is installed.
   */
  #convertResponse(json: JSONObject): JSONObject {
    if (inject('site') && !this.raw) {
      const fn = inject('site', 'convertResponse') as Function
      return fn(json)
    }
    return json
  }

  /**
   * Check array request params, allows only string, numbers and
   * arrays with strings or numbers.
   */
  #arrToParam(arr: any[]): any[] {
    const res: any[] = []
    each(arr, (val: any) => {
      if (isStr(val) || isNum(val)) {
        res.push(val)
      } else if (isArr(val)) {
        const sub = this.#arrToParam(val)
        if (count(sub) > 0) {
          res.push(sub)
        }
      }
    })
    return res
  }

  /**
   * Getting specified request options from this._options.
   */
  #getOptions(...args: string[]): IApiRequestOptions|null {
    const data: IApiRequestOptions = {}
    if (inArr('fields', args) && count(this.fields) > 0) {
      data.fields = this.fields
    }
    if (inArr('filter', args) && count(this.filter) > 0) {
      data.filter = this.filter
    }
    if (inArr('id', args) && isStr(this.id, 1)) {
      data.id = this.id
    }
    if (inArr('limit', args) && this.limit > 0) {
      data.limit = this.limit
    }
    if (inArr('offset', args) && this.offset > 0) {
      data.offset = this.offset
    }
    if (inArr('sort', args) && count(this.sort) > 0) {
      data.sort = this.sort
    }
    if (inArr('status', args) && isStr(this.status, 1)) {
      data.status = this.status
    }
    return count(data) > 0 ? data : null
  }
}

export default Request
