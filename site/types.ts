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
 * Logging/Debuggin
 */
declare global {
  interface IGlobalFunctions {
    log: Function
    warn: Function
    error: Function
  }
  interface Window {
    ahoi: IGlobalFunctions
  }
  const ahoi: IGlobalFunctions
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
  load(mixed: string, isPath?: boolean): Promise<void>
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
export interface IRoutes {
  [ key: string ]: string|string[]
}

export interface IRoutesNormalized {
  [ key: string ]: IRouteComponents,
  default: IRouteComponents
}

export type IRouteComponents = [ string ] | [ string, string ]

export interface IRouterOptions {
  history?: 'hash' | 'web' | 'memory',
  notfound: string
}