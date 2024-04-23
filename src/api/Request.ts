import { isObj, toPath, isUrl, upper, objToParam } from '../fn'
import Options from './Options'
import { inject } from './plugins'
import type { ApiOrder, Object, FormPostData, ApiMethods, JSONObject } from '../types'

/**
 * Class to handle a single request
 */
class Request {

  /**
   * Instance of Options
   */
  Options: Options

  /**
   */
  constructor(Options: Options) {
    this.Options = Options
  }

  /**
   * Chaining function to set `host`
   */
  host(host: string): this {
    this.Options.setHost(host)
    return this
  }

  /**
   * Chaining function to set `language`
   */
  lang(code: string): this {
    this.Options.setLang(code)
    return this
  }

  /**
   * Chaining function to set `fields`
   */
  fields(...args: string[]): this {
    this.Options.setFields(...args)
    return this
  }

  /**
   * Chaining function to set `fields` to `all`
   * Shortcut for fields(true)
   */
  all(): this {
    this.Options.setFields(true)
    return this
  }

  /**
   * Chaining function to set `limit`
   */
  limit(limit: number): this {
    this.Options.setLimit(limit)
    return this
  }

  /**
   * Chaining function to set `page`
   */
  set(no: number): this {
    this.Options.setSet(no)
    return this
  }

  /**
   * Chaining function to set `order`
   */
  order(order: ApiOrder): this {
    this.Options.setOrder(order)
    return this
  }

  /**
   * Chaining function to set `raw` to true
   */
  raw(): this {
    this.Options.setRaw(true)
    return this
  }

  /**
   * Call API interface /info.
   */
  async info(): Promise<JSONObject> {
    const url: string = this.getUrl(
      this.Options.getHost(), 
      this.Options.getVersion(),
      'info'
    )
    const res: JSONObject = await this.apiRequest(url)
    return this.parseResponse(res)
  }

  /**
   * Call API interface /language/(:any).
   */
  async language(lang: string): Promise<JSONObject> {
    const url: string = this.getUrl(
      this.Options.getHost(),
      this.Options.getVersion(),
      'language',
      this.Options.getLang(lang)
    )
    const res: JSONObject = await this.apiRequest(url)
    return this.parseResponse(res)
  }

  /**
   * Call API interface /page/(:all?).
   */
  async page(path: string): Promise<JSONObject> {
    const url: string = this.getUrl(
      this.Options.getHost(),
      this.Options.getVersion(),
      'page',
      this.Options.getLang(),
      path
    )
    const data: FormPostData = {
      fields: this.Options.getFieldsRequest(),
    }
    const res: JSONObject = await this.apiRequest(url, 'GET', data)
    return this.parseResponse(res)
  }

  /**
   * Call API interface /pages/(:all?).
   */
  async pages(path: string): Promise<JSONObject> {
    const url: string = this.getUrl(
      this.Options.getHost(), 
      this.Options.getVersion(),
      'pages',
      this.Options.getLang(),
      path
    )
    const data: FormPostData = {
      set: this.Options.getSet(),
      limit: this.Options.getLimit(),
      order: this.Options.getOrder(),
      fields: this.Options.getFieldsRequest(),
    }
    const res: JSONObject = await this.apiRequest(url, 'GET', data)
    return this.parseResponse(res)
  }

  /**
   * Post data to a specified action /action/(:any).
   */
  async create(action: string, data: FormPostData): Promise<JSONObject> {

    // get token
    const urlToken: string = this.getUrl(
      this.Options.getHost(), 
      this.Options.getVersion(),
      'token',
      this.Options.getLang(),
      action
    )
    const resToken: JSONObject = await this.apiRequest(urlToken)

    // submit
    const url: string = this.getUrl(
      this.Options.getHost(), 
      this.Options.getVersion(),
      'action',
      this.Options.getLang(),
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
    data: FormPostData|null = null
  ): Promise<Object>
  {
    const url: string = this.getUrl(
      this.Options.getHost(),
      this.Options.getVersion(),
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
   * Parse response, if parser plugin is installed.
   */
  parseResponse(json: JSONObject): JSONObject {
    if (this.Options.getRaw()) {
      return json
    }
    const fn = inject('parser', 'parseResponse', (json: JSONObject): JSONObject => json)
    return fn(json)
  }

  /**
   * Send API request and receive response.
   * 
   * @param {string} url 
   * @param {string} method GET, POST, PUT, DELETE
   * @param {object} data optional data, converts to post data or get-params
   * @returns {object} json, parsed if parser-plugin is installed
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
