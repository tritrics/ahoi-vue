import type { Object, IImmutableStore, JSONObject } from '../types'

export interface IFormStore extends IImmutableStore {
  getFieldValues(): IFormParams
  submit(): Promise<JSONObject>
  reset(): void
  validate(immediate?: boolean): void
}

export interface IFormParams {
  [ key: string ]: FormPostValue
}

export interface IFormOptions {
  fields?: Object
  action?: string
  lang?: string
  immediate?: boolean
}

export type FormPostValue =
  string |
  number |
  (string|number)[]


/**
 * Base Models
 */
export interface IFormBaseModel {
  id: string
  type: FormModelTypes
  value: any
  required: boolean
  valid: boolean
  msg: string|null
  validate(val?: any): void
  watch(start: boolean): void
  get(): FormPostValue
  set(value: any): void
  toString(): string
}

export interface IFormBaseStringModel extends IFormBaseModel {
  value: string
  minlength: number|null
  maxlength: number|null
  linebreaks: boolean
}

export interface IFormBaseDateModel extends IFormBaseModel {
  value: string
  format: string
  formatReg: RegExp
  min: Date|null
  max: Date|null
}

/**
 * Models
 */

export interface IFormBooleanModel extends IFormBaseModel {
  type: 'boolean'
  value: boolean
}

export interface IFormDateModel extends IFormBaseDateModel {
  type: 'date'
  time: boolean
}

export interface IFormEmailModel extends IFormBaseModel {
  type: 'email'
  value: string
}

export interface IFormNumberModel extends IFormBaseModel {
  type: 'number'
  min: number|null
  max: number|null
  step: number|null
  value: number
}

export interface IFormSelectModel extends IFormBaseModel {
  type: 'select'
  value: string|string[]
  multiple: boolean
  min?: number
  max?: number
  options: (string|number)[]
}

export interface IFormStringModel extends IFormBaseStringModel {
  type: 'string'
  linebreaks: false
}

export interface IFormTextModel extends IFormBaseStringModel {
  type: 'text'
  linebreaks: true
}

export interface IFormTimeModel extends IFormBaseDateModel {
  type: 'time'
}

export interface IFormUrlModel extends IFormBaseModel {
  type: 'url'
  value: string
}

export type FormModelTypes =
  | 'base'
  | 'boolean'
  | 'date'
  | 'email'
  | 'list'
  | 'number'
  | 'select'
  | 'string'
  | 'text'
  | 'time'
  | 'url'