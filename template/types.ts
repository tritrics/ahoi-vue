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

export interface ITemplateStore extends IImmutableStore {
  commitPage(): void
  loadHome(lang?: string|null): Promise<void>
  loadPage(node: string, fields?: string[]|boolean|'*', languages?: boolean|'*', commit?: boolean): Promise<void>
  loadPageByPath(path: string, fields?: string[]|boolean|'*', languages?: boolean|'*', commit?: boolean): Promise<void>
  loadSite(lang?: string|null): Promise<void>
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

export interface IDatetimeModel extends IBaseModel {
  type: DateTypes
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

export interface IEntriesModel extends IBaseModel {
  value: undefined
  entries: IBaseModel[]
  count(): number
  first(): IBaseModel|undefined
  has(index: number): boolean
  last(): IBaseModel|undefined
  nth(index: number): IBaseModel|undefined
}

export interface IFieldsModel extends IBaseModel {
  value: undefined
  fields?: Object
  has(field: string): boolean
}

export interface IObjectModel extends IFieldsModel {
  meta?: Object
  link?: ILinkModel
  languages?: ILanguageModel[]
  sortedLanguages(defaultFirst: boolean, byLang: boolean): ILanguageModel[]
}

/**
 * Models
 */
export interface IBlockModel extends IFieldsModel {
  type: 'block'
  block: string
  fields?: Object
}

export interface IBlocksModel extends IEntriesModel {
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

export interface IDateModel extends IDatetimeModel {
  type: 'date'
}

export interface IFileModel extends IObjectModel {
  type: 'file'
  isImage(): boolean
}

export interface IFilesModel extends IEntriesModel {
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
  interface: Object
  isMultilang(): boolean
  defaultLang(): string|null
}

export interface ILanguageModel extends IObjectModel {
  type: 'language'
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

export interface IOptionsModel extends IEntriesModel {
  type: 'options'
}

export interface IPageModel extends IObjectModel {
  type: 'page'
  collection?: ICollectionModel
  entries?: (IPageModel|IFileModel)[]
  blueprint(test?: string): string|boolean
}

export interface IPagesModel extends IEntriesModel {
  type: 'pages'
}

export interface ISiteModel extends IObjectModel {
  type: 'site'
}

export interface IStringModel extends IBaseModel {
  type: 'string'
  value: string
}

export interface IStructureModel extends IEntriesModel {
  type: 'structure'
}

export interface ITextModel extends IBaseModel {
  type: 'text'
  value: string
}

export interface ITimeModel extends IDatetimeModel {
   type: 'time'
}

export interface IUserModel extends IObjectModel {
  type: 'user'
}

export interface IUsersModel extends IEntriesModel {
  type: 'users'
}

export interface IModelList {
  [ key: string ]: IBaseModel
}

/**
 * Types
 */
export type DateTypes =
  | 'datetime'
  | 'date'
  | 'time'

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
  | 'user'
  | 'users'