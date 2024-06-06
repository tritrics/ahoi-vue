import type { Object } from '../types'
import type { Ref, WatchCallback, WatchOptions } from 'vue'

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

export interface IStore {
  get(key: string): any
  ref(key: string): Ref
  set(key: string|Object, val?: any): void
  watch<T>(source: string|string[], callback: WatchCallback<T>, options?: WatchOptions): Function
}

export type ApiMethods =
  'GET' |
  'POST' |
  'PUT' |
  'DELETE'

export type ApiOrder =
  'asc' |
  'desc'