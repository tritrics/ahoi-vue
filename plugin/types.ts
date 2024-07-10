import type { Ref, WatchCallback, WatchOptions, WatchStopHandle } from 'vue'
import type { Object, DateTimeFormat } from '../types'

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
  getNodeFromPath(val: string): string
  getHomeSlug(code?: string): string
  isValidLang(code: string|null|undefined): boolean
  isCurrentLang(code: string): boolean
  setLangFromDetected(): void
  setLangFromUrl(url?: string): void
  updateStores(): Promise<void>
}

export interface IApiAddon {
  name: string
  store?: IBaseStore
  export?: Object
  components?: Object
  init?: Function
  dependencies?: Function
}

export interface IApiOptions {
  host: string
  lang?: string
  langdetect?: boolean
  locale?: string
  debug?: boolean
  direction?: 'ltr' | 'rtl'
  nl2br?: boolean
  router?: boolean
  date?: DateTimeFormat
  time?: DateTimeFormat
  brand?: string
  title?: string
  keywords?: string
  description?: string
  image?: string
  addons?: IApiAddon[]
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