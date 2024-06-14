import type { Ref, WatchCallback, WatchOptions } from 'vue'
import type { Object } from '../types'

export interface IBaseStore {
  init(options?: Object): void
  get(key: string): any
  isFalse(key: string): boolean
  isTrue(key: string): boolean
  isEmpty(key: string): boolean
  ref(key: string): Ref
  set(key: string|Object, val?: any): void
  watch<T>(source: string|string[], callback: WatchCallback<T>, options?: WatchOptions): Function
}

export interface IGlobalStore extends IBaseStore {
  getOption(key: string, defaultVal?: any): any
  getDefaultLang(): string|null
  getLangFromUrl(href?: string): string|null
  getNodeFromPath(val: string): string
  isValidLang(code: string): boolean
  isCurrentLang(code: string): boolean
}

export interface IApiAddon {
  name: string
  store?: IBaseStore
  export?: Object
  components?: Object
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