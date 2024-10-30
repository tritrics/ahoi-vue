import type { Ref } from 'vue'
import type { Object, DateTimeFormat, IImmutableStore } from "../types"

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

export interface IFieldRefs {
  site: Object
  page: Object
  home: Object
}

export interface ISiteRefs {
  site: Ref<ISiteModel>
  page: Ref<IPageModel|null>
  home: Ref<IPageModel>
}

/**
 * Image / Thumb
 */
export interface IThumbModel {
  attr(asString: boolean): IImageAttributes|string
  image(): IImageModel
  options(): IThumbOptions
  preload(): Promise<any>
  src(): string
  toString(): string
}

export interface IImageModel {
  host: string
  dir: string
  name: string
  ext: string
  width: number
  height: number
  title?: string
}

export interface IImageAttributes {
  src: string|null
  width: number|null
  height: number|null
  alt: string|null
  crossorigin: null
}

export interface IThumbOptions {
  bw: boolean
  blur: number|null
  crop: ThumbCropOptions|boolean
  height: number|null,
  hires: boolean,
  ratio: number,
  quality: number|null
  title: string|null,
  width: number|null,
}

export interface IThumbDimensions {
  width: number
  height: number
}

export interface ISiteStore extends IImmutableStore {
  commitPage(): void
  getNextPageBlueprint(): string|undefined
  getNextPageTitle(): string|undefined
  loadHome(lang: string|null): Promise<void>
  loadPage(node: string, commit: boolean): Promise<void>
  loadPageByPath(path: string, commit: boolean): Promise<void>
  loadSite(lang: string|null): Promise<void>
  set(): void
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
  is(val: any): boolean
  isEmpty(): boolean
  isNot(val: any): boolean
  isNotEmpty(): boolean
  str(options?: Object): string
  toString(): string
}

export interface IBaseDateModel extends IBaseModel {
  value: Date,
  utc: string
  iso: string
  timezone: string
  defaultFormat: string
  day(): number|null
  format(format: string): string
  hours(): number|null
  isComing(): boolean
  isNow(): boolean
  isOver(): boolean
  minutes(): number|null
  month(): number|null
  year(): number|null
}

export interface IBaseEntriesModel extends IBaseModel {
  entries: IBaseModel[]
  count(): number
  first(): IBaseModel|undefined
  has(index: number): boolean
  last(): IBaseModel|undefined
  nth(index: number): IBaseModel|undefined
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
}

export interface IBlocksModel extends IBaseEntriesModel {
  type: 'blocks'
}

export interface IBooleanModel extends IBaseModel {
  type: 'boolean'
  value: boolean
  isFalse(): boolean 
  isTrue(): boolean
}

export interface ICollectionModel {
  total: number
  limit: number
  offset: number
  toString(): string
}

export interface IColorModel extends IBaseModel {
  type: 'color'
  format: string,
  alpha: boolean,
}

export interface IDateModel extends IBaseDateModel {
  type: 'date'
}

export interface IDatetimeModel extends IBaseDateModel {
  type: 'datetime'
}

export interface IFileModel extends IBaseFieldsModel {
  type: 'file'
  value: undefined
  meta?: IFileMeta
  link?: ILinkModel
  isImage(): boolean
}

export interface IFilesModel extends IBaseEntriesModel {
  type: 'files'
}

export interface IHtmlModel extends IBaseModel {
  type: 'html'
  value: Object
  has(): boolean
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
  attr: {
    'data-type': LinkTypes
    href: string
  }
  attrToStr(addLeadingSpace: boolean): string
  html(): string
  relPath(): string
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
  attrToStr(addLeadingSpace: boolean): string
  has(): boolean
  html(options: Object): string
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
  meta?: IPageMeta
  link?: ILinkModel
  translations?: ITranslationModel[]
  collection?: ICollectionModel
  entries?: (IPageModel|IFileModel)[]
  blueprint(test?: string): string|boolean
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
}

export interface ITranslationModel extends IBaseModel {
  type: 'translation'
  link: ILinkModel
}

export interface IUserModel extends IBaseFieldsModel {
  type: 'user'
  meta?: Object
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
  | 'blocks'
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