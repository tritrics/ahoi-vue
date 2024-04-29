/**
 * API-plugin-plugin interface
 */
export interface ApiPlugin {
  id: string
  name: string
  export: Object
  components?: Object
  setup?: Function // before init
  init?: Function
}

/**
 * API methods
 */
export type ApiMethods = 'GET' | 'POST' | 'PUT' | 'DELETE'

/**
 * Order for RequestParams
 */
export type ApiOrder = 'asc' | 'desc'

/**
 * API-Plugin parameter
 */
export interface ApiOptions {
  name?: string,
  host?: string,
  lang?: string,
  plugins?: ApiPlugin[],
  request?: ApiRequestOptions
}

/**
 * Request parameter
 */
export interface ApiRequestOptionsAll {
  host: string|null
  lang: string|null
  fields: string[]
  limit: number
  set: number
  order: ApiOrder
  raw: boolean
  multilang: boolean
}

/**
 * Request parameter given by user
 */
export interface ApiRequestOptions {
  host?: string|null
  lang?: string|null
  fields?: string[]
  limit?: number
  set?: number
  order?: ApiOrder
  raw?: boolean
}