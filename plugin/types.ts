import type { Ref, WatchCallback, WatchOptions, WatchStopHandle } from 'vue'
import type { Object, DateTimeFormat } from '../types'

export interface IBaseStore {
  ADD_PROPERTIES: boolean
  get(key: string): any
  has(key: string): boolean
  init(): Promise<void>
  is(key: string, val: any): boolean
  isEmpty(key: string): boolean
  isFalse(key: string): boolean
  isNot(key: string, val: any): boolean
  isNotEmpty(key: string): boolean
  isTrue(key: string): boolean
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

export interface IImmutableStore extends IBaseStore {
  ADD_PROPERTIES: false
}

export interface IMainStore extends IImmutableStore {
  getNodeFromPath(val: string): string
  getHomeSlug(lang?: string): string
  hasRouter(): boolean
  isValidLang(lang: string|null|undefined): boolean
  isCurrentLang(lang: string): boolean
  setLangFromDetected(): void
  setLangFromUrl(url?: string): boolean
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
  addons?: IApiAddon[]
  brand?: string
  date?: DateTimeFormat
  description?: string
  direction?: 'ltr' | 'rtl'
  host: string
  image?: string
  keywords?: string
  lang?: string
  langdetect?: boolean
  locale?: string
  meta?: Object
  nl2br?: boolean
  router?: boolean|Object
  time?: DateTimeFormat
  title?: string
}

export interface IApiRequestOptions {
  fields?: string[]|boolean|'*'
  filter?: any[]
  host?: string|null
  id?: string
  languages?: boolean|'*'
  limit?: number
  offset?: number
  raw?: boolean
  sort?: any[]
  status?: ApiPagesStatus
}

export type ApiMethods =
  'GET' |
  'POST' |
  'PUT' |
  'DELETE'

export type ApiPagesStatus =
  'listed' |
  'unlisted' |
  'published'