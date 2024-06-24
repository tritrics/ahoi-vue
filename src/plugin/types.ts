import type { Ref, WatchCallback, WatchOptions, WatchStopHandle } from 'vue'
import type { Object } from '../types'

export interface IBaseStore {
  ADD_PROPERTIES: boolean
  get(key: string): any
  has(key: string): boolean
  init(): Promise<void>
  is(key: string, val: any): boolean
  isNot(key: string, val: any): boolean
  isFalse(key: string): boolean
  isTrue(key: string): boolean
  isEmpty(key: string): boolean
  ref(key: string): Ref
  set(key: string, val?: any): void
  stop(): void
  watch<T>(keys: string|string[], callback: WatchCallback<T>, options?: WatchOptions): WatchStopHandle
}

export interface IStoreData {
  [ key: string ]: IStoreDataValue
}

export interface IStoreDataValue {
  ref: Ref,
  watchstop: WatchStopHandle[]
}

export interface IAddonStore extends IBaseStore {
  ADD_PROPERTIES: false
}

export interface IUserStore extends IBaseStore {
  ADD_PROPERTIES: true
}

export interface IGlobalStore extends IAddonStore {
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
  addons?: Function[],
  request?: IApiRequestOptions
}

export interface IApiRequestOptions {
  host?: string|null
  lang?: string|null
  fields?: string[]
  limit?: number
  set?: number
  order?: ApiOrder
  raw?: boolean
  id?: string
}

export type ApiMethods =
  'GET' |
  'POST' |
  'PUT' |
  'DELETE'

export type ApiOrder =
  'asc' |
  'desc'