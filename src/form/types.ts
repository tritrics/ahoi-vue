import type { ComputedRef } from 'vue'
import type { Object, IAddonStore, JSONObject } from '../types'

export interface IFormStore extends IAddonStore {
  valid: ComputedRef<boolean>
  getFieldValues(): IFormParams
  submit(): Promise<JSONObject>
  reset(): void
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

