import type { Object } from '../types'

export interface IFormParams {
  [ key: string ]: FormPostValue
}

export interface IFormOptions {
  action?: string
  lang?: string
  immediate?: boolean
}

export interface IFormModel extends Object {
  type: FormModelTypes
  id: string
  value: any
  required: boolean
  msg: string
  valid: boolean
  validate: (dummy?: any) => void
  data: () => FormPostValue
  toString: () => string
  setValid: (msg?: string) => void
  watch: (start: boolean) => void
  stop: null | (() => void)
}

export type FormPostValue =
  string |
  number |
  (string|number)[]

export type FormModelTypes =
  'boolean' |
  'date' |
  'email' |
  'list' |
  'number' |
  'select' |
  'string' |
  'text' |
  'time' |
  'url'