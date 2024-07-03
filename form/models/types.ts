import type { FormPostValue } from "../types"

/**
 * Base Models
 */
export interface IBaseModel {
  id: string
  type: ModelTypes
  value: any
  required: boolean
  valid: boolean
  msg: string|null
  parent?: IListModel
  stop: Function|null
  validate(val?: any): void
  setValid(msg: string): void
  watch(start: boolean): void
  data(): FormPostValue
  delete(id?: string): void
  toString(): string
}

export interface IBaseStringModel extends IBaseModel {
  value: string
  minlength: number|null
  maxlength: number|null
  linebreaks: boolean
}

export interface IBaseDateModel extends IBaseModel {
  value: string
  format: string
  formatReg: RegExp
  min: Date|null
  max: Date|null
}

/**
 * Models
 */

export interface IBooleanModel extends IBaseModel {
  type: 'boolean'
  value: boolean
}

export interface IDateModel extends IBaseDateModel {
  type: 'date'
  time: boolean
}

export interface IEmailModel extends IBaseModel {
  type: 'email'
  value: string
}

export interface IListModel extends IBaseModel {
  type: 'list'
  value: IStringModel[]
  min: number|null
  max: number|null
  minlength: number|null
  maxlength: number|null
  add(value: string): void
  delete(id: string): void
}

export interface INumberModel extends IBaseModel {
  type: 'number'
  value: number
}

export interface ISelectModel extends IBaseModel {
  type: 'select'
  value: string|string[]
  multiple: boolean
  min?: number
  max?: number
  options: (string|number)[]
}

export interface IStringModel extends IBaseStringModel {
  type: 'string'
  linebreaks: false
}

export interface ITextModel extends IBaseStringModel {
  type: 'text'
  linebreaks: true
}

export interface ITimeModel extends IBaseDateModel {
  type: 'time'
}

export interface IUrlModel extends IBaseModel {
  type: 'url'
  value: string
}

export type ModelTypes =
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