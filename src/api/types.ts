export interface IApiAddon {
  name: string
  export: Object
  components?: Object
  setup?: Function // before init
  init?: Function
}

export interface IApiOptions {
  name?: string,
  host?: string,
  lang?: string,
  addons?: IApiAddon[],
  request?: IApiRequestOptions
}

export interface IApiRequestOptionsAll {
  host: string|null
  lang: string|null
  fields: string[]
  limit: number
  set: number
  order: ApiOrder
  raw: boolean
  multilang: boolean
}

export interface IApiRequestOptions {
  host?: string|null
  lang?: string|null
  fields?: string[]
  limit?: number
  set?: number
  order?: ApiOrder
  raw?: boolean
}

export type ApiMethods =
  'GET' |
  'POST' |
  'PUT' |
  'DELETE'

export type ApiOrder =
  'asc' |
  'desc'