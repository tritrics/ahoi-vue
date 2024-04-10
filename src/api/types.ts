/**
 * API-plugin-plugin interface
 */
export interface ApiPlugin {
  id: string
  name: string
  export: Object
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
export interface ApiParams {
  name?: string,
  host?: string,
  lang?: string,
  plugins?: ApiPlugin[],
  request?: ApiRequestParams
}

/**
 * Request parameter
 */
export interface ApiRequestParams {
  host?: string|null
  lang?: string|null
  fields?: string[]|boolean
  limit?: number
  set?: number
  order?: ApiOrder
  raw?: boolean
  multilang?: boolean
}