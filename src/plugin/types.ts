import type { Ref } from 'vue'
import type { Object } from '../types'

export interface IBaseStore {
  ADD_PROPERTIES: boolean
  get(key: string): any
  has(key: string): boolean
  is(key: string, val: any): boolean
  isNot(key: string, val: any): boolean
  isFalse(key: string): boolean
  isTrue(key: string): boolean
  isEmpty(key: string): boolean
  ref(key: string): Ref
  set(key: string|Object, val?: any): void
  stop(): void
  watch(source: string|string[], callback: IWatchCallback, options?: IWatchOptions): Promise<IWatchStop>
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

export interface IStoreData {
  [ key: string ]: {
    ref: Ref<any>
    observer: IWatchDefintion[]
  }
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

export type IWatchCallback = (newVal: any, oldVal?: any, playload?: any) => Promise<void>

export type IWatchStop = () => void

export interface IWatchOptions {
  immediate?: boolean
  payload?: any
}

export interface IWatchDefintion {
  id: string
  callback: Function
  options: IWatchOptions
}

export type ApiMethods =
  'GET' |
  'POST' |
  'PUT' |
  'DELETE'

export type ApiOrder =
  'asc' |
  'desc'