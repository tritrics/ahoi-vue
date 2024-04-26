import type { Object } from '../types'

/**
 * Post value
 */
export type FormPostValue = string | number | (string|number)[]

/**
 * Post object
 */
export interface FormPostData {
  [ key: string ]: FormPostValue
}

/**
 * API-plugin-plugin Form options
 */
export interface FormOptions {
  action?: string
  lang?: string
  immediate?: boolean
}

/**
 * Form model types/fields
 */
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

/**
 * Form Model
 */
export interface FormModel extends Object {
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