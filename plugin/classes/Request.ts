import { upper, count, objToParam, inArr, isStr, isObj, isUrl } from '../../utils'
import type { Object, ApiMethods, JSONObject } from '../../types'

/**
 * Class to handle a single request
 */
class Request {

  url: string = ''

  /**
   * The request options specifing the requested data (fields, sort, limit ...)
   * or form data.
   */
  data: Object = {}

  /**
   * Use a given method, otherwise auto-detect.
   * Values: GET, POST, PUT, DELETE
   */
  forceMethod: ApiMethods|null = null

  /**
   */
  constructor(url: string, data: Object = {}, forceMethod: ApiMethods|null = null) {
    if (isUrl(url)) {
      this.url = url
    } else {
      throw new Error('AHOI Plugin: No url defined for Api request')
    }
    if (isObj(data)) {
      this.data = data
    }
    if (isStr(forceMethod, 1) && inArr(upper(forceMethod), ['GET', 'POST', 'PUT', 'DELETE'])) {
      this.forceMethod = upper(forceMethod) as ApiMethods
    }
  }

  /**
   * Send API request and receive response.
   */
  async send() : Promise<JSONObject> {

    let url: string = this.url

    // init options
    const options: Object = {
      mode: 'cors',
      cache:'no-cache',
    }

    // check method
    if (isStr(this.forceMethod, 1)) {
      options.method = this.forceMethod
    } else if (count(this.data) > 0) {
      options.method = 'POST'
    } else {
      options.method = 'GET'
    }

    // data in url or body
    if (count(this.data) > 0) {
      if (options.method === 'GET') {
        url = `${url}${objToParam(this.data)}`
      } else {
        options.headers = { 'content-type': 'application/json' }
        options.body = JSON.stringify(this.data)
      }
    }

    // request
    const response = await fetch(url, options)
    const json: JSONObject = await response.json()

    // error
    if (!response.ok || !json.ok) {
      const msg = json.msg || response.status
      const status = json.status || response.statusText
      throw new Error(`AHOI Plugin: API reports an error while requesting ${url}: ${msg} (Error ${status})`)
    }

    // OK
    return json
  }
}

export default Request
