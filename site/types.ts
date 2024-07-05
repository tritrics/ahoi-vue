import type { RouteRecordRaw } from 'vue-router'
import type { Object, DateTimeFormat, IAddonStore } from "../types"

/**
 * Plugin
 */
export interface IsiteOptions {
  router?: boolean
  locale?: string
  nl2br?: boolean
  fixed?: boolean
  date?:  DateTimeFormat 
  time?: DateTimeFormat
}

/**
 * Image / Thumb
 */
export interface IThumbModel {
  dim(width?: number|null, height?: number|null): IThumbModel
  crop(crop?: ThumbCropOptions|boolean): IThumbModel
  blur(blur?: number): IThumbModel
  bw(bw?: boolean): IThumbModel
  quality(quality?: number): IThumbModel
  attr(asString: boolean): string|Object
  preload(): Promise<any>
  toString(): string
}

export interface IThumbImage {
  host: string
  dir: string
  name: string
  ext: string
  width: number
  height: number
  title?: string
}

export interface IThumbOptions {
  width?: number|null,
  height?: number|null,
  crop?: ThumbCropOptions|boolean
  blur?: number|null
  bw?: boolean
  quality?: number|null
}

export interface IThumbDimensions {
  width: number
  height: number
}

export interface ISiteStore extends IAddonStore {
  load(lang: string|null): Promise<void>
}

export interface IHomeStore extends IAddonStore {
  load(lang: string|null): Promise<void>
}

export interface IPageStore extends IAddonStore {
  load(node: string): Promise<void>
  loadByPath(path: string): Promise<void>
}

export type ThumbCropOptions =
  | 'top-left'
  | 'top'
  | 'top-right'
  | 'left'
  | 'center'
  | 'right'
  | 'bottom-left'
  | 'bottom'
  | 'bottom-right'

/**
 * Router
 */
export interface IRouterOptions {
  history?: 'hash' | 'web' | 'memory',
  scroll?: boolean
  default: IRouteOptions
  notfound?: IRouteOptions
  blueprints?: {
    [ key: string ]: IRouteOptions
  }
}

export interface IRoutes {
  get(blueprint: string|false, path: string, meta: Object): RouteRecordRaw
}

export type IRouteOptions = string | IRouteOptionsComponent | IRouteOptionsComponents

interface IRouteOptionsComponent extends Object {
  component: string
  [ key: string ]: any
}

interface IRouteOptionsComponents extends Object {
  components: Object
  [ key: string ]: any
}

export interface IRouteNormalized {
  meta: Object
  components: Object
}