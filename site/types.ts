import type { Object, DateTimeFormat, IAddonStore } from "../types"

/**
 * Plugin
 */
export interface ISiteOptions {
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
  attr(asString: boolean): string|Object
  blur(blur?: number): IThumbModel
  bw(bw?: boolean): IThumbModel
  crop(crop?: ThumbCropOptions|boolean): IThumbModel
  dim(width?: number|null, height?: number|null): IThumbModel
  options(options: IThumbOptions): IThumbModel
  preload(): Promise<any>
  quality(quality?: number): IThumbModel
  src(): string
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
 * Models
 */
export interface IBaseModel {
  type: ModelTypes
  value: any
  get(): any
  str(options?: Object): string
  toString(): string
}

export interface IBaseDateModel extends IBaseModel {
  value: Date,
  utc: string
  iso: string
  timezone: string
}

export interface IBaseEntriesModel extends IBaseModel {
  entries: IBaseModel[]
  first(): IBaseModel|undefined
}

export interface IBaseFieldsModel extends IBaseModel {
  fields?: Object,
  has(field: string): boolean
}

/**
 * Models
 */
export interface IBlockModel extends IBaseModel {
  type: 'block'
  value: string
  block: string
  fields?: Object
  is(val: string): boolean
}

export interface IBooleanModel extends IBaseModel {
  type: 'boolean'
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
  type: 'color'
  format: string,
  alpha: boolean,
}

export interface IDateModel extends IBaseDateModel {
  type: 'date'
  isOver(): boolean
  isComing(): boolean
  isNow(): boolean
}

export interface IDatetimeModel extends IBaseDateModel {
  type: 'datetime'
  isOver(): boolean
  isComing(): boolean
  isNow(): boolean
}

export interface IFileModel extends IBaseFieldsModel {
  type: 'file'
  value: undefined
  meta: IFileMeta
  link: ILinkModel
  isImage(): boolean
}

export interface IFilesModel extends IBaseEntriesModel {
  type: 'files'
}

export interface IHtmlModel extends IBaseModel {
  type: 'html'
  value: Object
  hasChildren(): boolean
}

export interface IInfoModel extends IBaseModel {
  type: 'info'
  value: undefined
  meta: IInfoMeta
  languages?: ILanguageModel[]
  sites?: ISiteModel[]
  site?: ISiteModel
}

export interface ILanguageModel extends IBaseModel {
  type: 'language'
  value: string
  meta: ILanguageMeta
  fields?: Object
  code: string
  isDefault(): boolean
  has(field: string): boolean
}

export interface ILinkModel extends IBaseModel {
  type: 'link'
  value: string
  meta: {
    type: LinkTypes
    href: string
  }
}

export interface IMarkdownModel extends IBaseModel {
  type: 'markdown'
  value: string
}

export interface INumberModel extends IBaseModel {
  type: 'number'
  value: number
  isMin(min: number): boolean
  isMax(max: number): boolean
  isGreater(min: number): boolean
  isSmaller(max: number): boolean
  isBetween(min: number, max: number): boolean
}

export interface INodeModel extends IBaseModel {
  type: NodeModelTypes
  elem: string
  attr: Object
}

export interface IOptionModel extends IBaseModel {
  type: 'option'
  value: string
  label?: string
}

export interface IOptionsModel extends IBaseEntriesModel {
  type: 'options'
}

export interface IPageModel extends IBaseFieldsModel {
  type: 'page'
  value: undefined
  meta: IPageMeta
  link: ILinkModel
  translations?: ITranslationModel[]
  collection?: ICollectionModel
  entries?: (IPageModel|IFileModel)[]
}

export interface IPagesModel extends IBaseEntriesModel {
  type: 'pages'
}

export interface ISiteModel extends IBaseFieldsModel {
  type: 'site'
  value: undefined
  meta: IPageMeta
}

export interface IStringModel extends IBaseModel {
  type: 'string'
  value: string
}

export interface IStructureModel extends IBaseEntriesModel {
  type: 'structure'
}

export interface ITextModel extends IBaseModel {
  type: 'text'
  value: string
}

export interface ITimeModel extends IBaseDateModel {
  type: 'time'
  isOver(): boolean
  isComing(): boolean
  isNow(): boolean
}

export interface ITranslationModel extends IBaseModel {
  type: 'translation'
  link: ILinkModel
}

export interface IUserModel extends IBaseFieldsModel {
  type: 'user'
  meta: Object
}

export interface IUsersModel extends IBaseEntriesModel {
  type: 'users'
}

export interface IModelList {
  [ key: string ]: IBaseModel
}

/**
 * Metadata as used in models
 */
export interface IFileMeta {
  host: string
  dir: string
  file: string
  name: string
  ext: string
  href: string
  node: string
  lang?: string
  filetype: 'image' | 'file'
  blueprint: string
  title: string
  modified: Date
  translations?: {
    lang: string
    href: string
    node: string
  }[]
}

export interface IImageMeta extends IFileMeta {
  width: number
  height: number
}

export interface IInfoMeta {
  multilang: boolean
  [ key: string ]: any
}

export interface ILanguageMeta {
  code: string
  title: string
  default: boolean
  origin?: string
  slug: string
  locale: string
  direction: string
}

export interface ISiteMeta {
  node: string
  lang?: string
  blueprint: 'site'
  title: string
  modified: Date
  translations?: {
    lang: string
    node: string
  }[]
  api?: Object
}

export interface IPageMeta {
  slug: string
  href: string
  node: string
  lang?: string
  blueprint: string
  status: string
  sort: number
  home: boolean
  title: string
  modified: Date
  translations?: {
    lang: string
    href: string
    node: string
  }[]
  api?: Object
}

/**
 * Types
 */
export type LinkTypes =
  | 'url'
  | 'page'
  | 'file'
  | 'email'
  | 'tel'
  | 'anchor'
  | 'custom'

export type NodeModelTypes =
  | 'node'
  | 'node-text'
  | 'node-self-closing'

export type ModelTypes =
  | NodeModelTypes
  | 'base'
  | 'block'
  | 'boolean'
  | 'color'
  | 'date'
  | 'datetime'
  | 'file'
  | 'files'
  | 'html'
  | 'image'
  | 'info'
  | 'language'
  | 'link'
  | 'markdown'
  | 'number'
  | 'object'
  | 'option'
  | 'options'
  | 'page'
  | 'pages'
  | 'site'
  | 'string'
  | 'structure'
  | 'text'
  | 'time'
  | 'translation'
  | 'user'
  | 'users'