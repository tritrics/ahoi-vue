import type { Object, DateTimeFormat } from "../types"

export interface ICoreOptions {
  router?: boolean
  locale?: string
  nl2br?: boolean
  fixed?: boolean
  date?:  DateTimeFormat 
  time?: DateTimeFormat
}

export interface IImageOptions {
  width?: number,
  height?: number,
  crop?: boolean
  blur?: number
  bw?: boolean
  quality?: number
  title?: string
}

export interface IImage {
  width: number,
  height: number,
  ext: string,
  dir: string,
  filename: string,
  [ index: string ]: any
}

export interface IImageDimensions {
  width: number
  height: number
}

export interface IBaseModel {
  type: ModelTypes,
  value: any,
  str(options?: Object): string
  toString(): string
}

export interface IBlockModel extends IBaseModel {
  value: string
  fields?: Object
  is(val: string): boolean
}

export interface IBooleanModel extends IBaseModel {
  value: boolean
}

export interface ICollectionModel {
  set: number
  limit: number
  count: number
  start: number
  end: number
  sets: number
  total: number
  hasPrev(count: number): boolean
  hasNext(count: number): boolean
  prev(count: number): number
  next(count: number): number
  toString(): string
}

export interface IColorModel extends IBaseModel {
  format: string,
  alpha: boolean,
}

export interface IDateModel extends IBaseModel {
  value: Date,
  utc: string
  iso: string
  timezone: string
  isOver(): boolean
  isComing(): boolean
  isNow(): boolean
}

export interface IFileModel extends IBaseModel {
  value: undefined
  meta: IFileMeta
  link: ILinkModel
  fields?: Object
  isImage(): boolean
  has(field: string): boolean
  attr(asString: boolean): string|Object 
}

export interface IHtmlModel extends IBaseModel {
  value: Object
  hasChildren(): boolean
}

export interface IInfoModel extends IBaseModel {
  value: undefined
  meta: IInfoMeta
  languages?: ILanguageModel[]
}

export interface ILanguageModel extends IBaseModel {
  value: undefined
  meta: ILanguageMeta
  fields?: Object
  code(): string
  locale(): string
  title(): string
  direction(): string
  isDefault(): boolean
  has(field: string): boolean
}

export interface ILinkModel extends IBaseModel {
  value: string
  attributes: Object
  attr(asString: boolean): string|Object
}

export interface INumberModel extends IBaseModel {
  value: number
  isMin(min: number): boolean
  isMax(max: number): boolean
  isGreater(min: number): boolean
  isSmaller(max: number): boolean
  isBetween(min: number, max: number): boolean
}

export interface INodeModel extends IBaseModel {
  element?: string
  attributes?: Object
}

export interface IObjectModel extends IBaseModel {
  meta?: Object
  link?: ILinkModel
  fields?: Object
  has(field: string): boolean
  attr(asString: boolean): string|Object
}

export interface IPageModel extends IBaseModel {
  value: undefined
  meta: IPageMeta
  link: ILinkModel
  fields?: Object
  collection?: ICollectionModel
  entries?: (IPageModel|IFileModel)[]
  blueprint(): string
  isHome(): boolean
  has(field: string): boolean
  attr(asString: boolean): string|Object 
}

export interface IOptionModel extends IBaseModel {
  value: string
  label?: IStringModel
}

export interface IStringModel extends IBaseModel {
  value: string
}

export interface IFileMeta {
  host: string
  dir: string
  file: string
  name: string
  ext: string
  href: string
  filetype: 'image' | 'file'
  blueprint: string
  title: string
  lang: string
  modified: Date
  width?: number
  height?: number
  node: string|Object
}

export interface IInfoMeta {
  multilang: boolean
  [ key: string ]: any
}

export interface ILanguageMeta {
  code: string
  title: string
  default: boolean
  locale: string
  direction: string
}

export interface IPageMeta {
  id: string
  slug: string
  href: string
  parent: string
  blueprint: string
  title: string
  status: string
  sort: number
  home: boolean
  lang: string
  modified: Date
  node: string|Object
}

export type LinkTypes =
  'page' |
  'file' |
  'email' |
  'tel' |
  'anchor' |
  'custom'

export type NodeModelTypes =
  'node' |
  'node-text' |
  'node-self-closing'

export type ModelTypes =
  NodeModelTypes |
  'base' |
  'block' |
  'boolean' |
  'color' |
  'date' |
  'datetime' |
  'file' |
  'html' |
  'image' |
  'info' |
  'language' |
  'link' |
  'markdown' |
  'number' |
  'option' |
  'page' |
  'string' |
  'text' |
  'time' |
  'translations' |
  'user'

export type ImageCropOptions =
  'top-left' |
  'top' |
  'top-right' |
  'left' |
  'center' |
  'right' |
  'bottom-left' |
  'bottom' |
  'bottom-right'