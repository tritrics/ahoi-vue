import { each, count, unique, inArr, isStr, isUrl, isArr, isNum, isInt, isTrue, toPath, toKey, toInt } from '../../utils'
import { Request, inject, mainStore, APIVERSION } from '../index'
import type { Object, IFormParams, IApiRequestOptions, ApiPagesStatus, JSONObject } from '../../types'

/**
 * Call API interface /file/(:all?).
 * Returns information of a single page or site (if node is empty).
 */
export async function getFile(path: string|string[], requestOptions?: IApiRequestOptions ): Promise<JSONObject> {
  const options = Object.assign({}, requestOptions)
  const request = new Request(
    getUrl(options, APIVERSION, 'file', path),
    getOptions(options, 'fields', 'languages', 'id')
  )
  const json = await request.send()
  return convertResponse(options, json)
}

/**
 * Call API interface /pages/(:all?).
 * Returns information of sub-pages of a single page or site (if node is empty).
 */
export async function getFiles(path: string|string[], requestOptions?: IApiRequestOptions): Promise<JSONObject> {
  const options = Object.assign({}, requestOptions)
  const request = new Request(
    getUrl(options, APIVERSION, 'files', path),
    getOptions(options, 'fields', 'filter', 'id', 'limit', 'offset', 'sort', 'status')
  )
  const json = await request.send()
  return convertResponse(options, json)
}

/**
 * Call API interface /info.
 * Returns global information about the site.
 */
export async function getInfo(requestOptions?: IApiRequestOptions): Promise<JSONObject> {
  const options = Object.assign({}, requestOptions)
  const request = new Request(
    getUrl(options, APIVERSION, 'info')
  )
  const json = await request.send()
  return convertResponse(options, json)
}

/**
 * Call API interface /language/(:any).
 * Returns information from a single language.
 */
export async function getLanguage(lang: string, requestOptions?: IApiRequestOptions): Promise<JSONObject> {
  const options = Object.assign({}, requestOptions)
  const request = new Request(
    getUrl(options, APIVERSION, 'language', lang),
    getOptions(options, 'fields', 'id'),
    'GET'
  )
  const json = await request.send()
  return convertResponse(options, json)
}

/**
 * Call API interface /page/(:all?).
 * Returns information of a single page or site (if node is empty).
 */
export async function getPage(path: string|string[]|null = null, requestOptions?: IApiRequestOptions): Promise<JSONObject> {
  const options = Object.assign({}, requestOptions)
  const request = new Request(
    getUrl(options, APIVERSION, 'page', path),
    getOptions(options, 'fields', 'languages', 'id')
  )
  const json = await request.send()
  return convertResponse(options, json)
}

/**
 * Call API interface /pages/(:all?).
 * Returns information of sub-pages of a single page or site (if node is empty).
 */
export async function getPages(path: string|string[]|null = null, requestOptions?: IApiRequestOptions): Promise<JSONObject> {
  const options = Object.assign({}, requestOptions)
  const request = new Request(
    getUrl(options, APIVERSION, 'pages', path),
    getOptions(options, 'fields', 'filter', 'id', 'limit', 'offset', 'sort', 'status')
  )
  const json = await request.send()
  return convertResponse(options, json)
}

/**
 * Submit data to a specified action /action/(:any).
 */
export async function postCreate(action: string|string[], data: IFormParams = {}, requestOptions?: IApiRequestOptions): Promise<JSONObject> {
  const options = Object.assign({}, requestOptions)
  const tokenRequest = new Request(
    getUrl(options, APIVERSION, 'token', action),
  )
  const tokenResponse = await tokenRequest.send()
  const request = new Request(
    getUrl(options, APIVERSION, 'action', action, tokenResponse.body.token as string),
    data,
    'POST'
  )
  const json = await request.send()
  return json
}

/**
 * Parse response, if core plugin is installed.
 */
function convertResponse(requestOptions: Object, json: JSONObject): JSONObject {
  if (inject('template') && !isTrue(requestOptions.raw)) {
    const fn = inject('template', 'convertResponse') as Function
    return fn(json)
  }
  return json
}

/**
 * Getting specified request options from user-given or default options.
 */
function getOptions(requestOptions: IApiRequestOptions, ...args: string[]): IApiRequestOptions|undefined {
  const options: IApiRequestOptions = {}

  /**
   * Get option `fields`.
   * Fields can be array with single fieldnames or subarray:
   * this.options.fields = [ field1, field2, [field3, field4]]
   * If fields is '*' or true, it's translated to [ '*' ]
   */
  if (inArr('fields', args)) {
    const res: string[] = []
    if (isArr(requestOptions.fields)) {
      each (requestOptions.fields, (arg: any) => {
        each(isArr(arg) ? arg : [ arg ], (field: any) => {
          if (isStr(field, 1)) {
            res.push(toKey(field))
          }
        })
      })
      const fields = unique(res)
      if (fields.length > 0) {
        options.fields = fields
      }
    } else if (isTrue(requestOptions.fields) || requestOptions.fields === '*') {
      options.fields = [ '*' ]
    }
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
  if (inArr('filter', args) && isArr(requestOptions.filter)) {
    const filter = arrToParam(requestOptions.filter)
    if (count(filter) > 0) {
      options.filter = filter
    }
  }

  /**
   * ID can be any value. The ID is returned as it is by response.
   * Used to avoid race conditions.
   */
  if (inArr('id', args) && isStr(requestOptions.id, 1)) {
    options.id = requestOptions.id
  }

  /**
   * Get option `limit`.
   * Used in API request pages() to limit the number of returned pages.
   */
  if (inArr('languages', args)) {
    options.languages = isTrue(requestOptions.languages) || requestOptions.languages === '*'
  }

  /**
   * Get option `limit`.
   * Used in API request pages() to limit the number of returned pages.
   */
  if (inArr('limit', args) && isInt(requestOptions.limit, 1)) {
    options.limit = toInt(requestOptions.limit)
  }

  /**
   * Get option `offset`.
   * Used in API request pages() to get a specified result set in combination with limit.
   */
  if (inArr('offset', args) && isInt(requestOptions.offset, 1)) {
    options.offset = toInt(requestOptions.offset)
  }

  /**
   * Get option `sort`.
   * Used in API request pages() sort the returned pages ascending or descending.
   */
  if (inArr('sort', args) && isArr(requestOptions.sort)) {
    const sort = arrToParam(requestOptions.sort)
    if (count(sort) > 0) {
      options.sort = sort
    }    
  }

  /**
   * Get option `status`
   * Status of pages in collection request. Can be listed, unlisted or
   * published (= listed or unlisted).
   */
  if (inArr('status', args) && isStr(requestOptions.status)) {
    const status: string = toKey(requestOptions.status)
    if (inArr(status, ['listed', 'unlisted', 'published'])) {
      options.status = status as ApiPagesStatus
    }
  }  
  return count(options) > 0 ? options : undefined
}

/**
 * Helper to build an URL from multiple parts.
 */
function getUrl(requestOptions: Object, ...args: (string|string[]|null)[]): string {

  // getting host from options or global store
  // Host must be the fully qualified hostname followed by the api-slug like set in Kirby's config.
  let host: string|null = null
  if (isUrl(requestOptions.host)) {
    host = requestOptions.host
  } else if (isUrl(mainStore.get('host'))) {
    host = mainStore.get('host')
  }
  if (isStr(host) && host.endsWith('/')) {
    host = host.substring(0, host.length - 1)
  }

  // building url
  return toPath([ host, ...args ])
}

/**
 * Check array request params, allows only string, numbers and
 * arrays with strings or numbers.
 */
function arrToParam(arr: any[]): any[] {
  const res: any[] = []
  each(arr, (val: any) => {
    if (isStr(val) || isNum(val)) {
      res.push(val)
    } else if (isArr(val)) {
      const sub = arrToParam(val)
      if (count(sub) > 0) {
        res.push(sub)
      }
    }
  })
  return res
}