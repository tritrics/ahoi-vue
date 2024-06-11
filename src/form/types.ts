import type { ComputedRef } from 'vue'
import type { Object, IBaseStore, JSONObject } from '../types'

export interface IFormStore extends IBaseStore {
  valid: ComputedRef<boolean>
  getFieldValues(): IFormParams
  submit(): Promise<JSONObject>
  validate(onInput: boolean): void
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

