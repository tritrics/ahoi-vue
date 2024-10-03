import { has, isTrue, isInt, toInt, isArr, toStr, isEmpty, inArr } from '../../utils'
import BaseModel from './Base'
import type { IFormSelectModel } from '../types'
import type { Object } from '../../types'

 /**
  * Model to represent a select input
  */
export default class SelectModel extends BaseModel implements IFormSelectModel {

  /**
   * Type
   */
  type: 'select' = 'select'

  /**
   * Flag to enable multiple selection
   */
  multiple: boolean

  /**
   * Minimum number of selected entries (on multiple selection)
   */
  min?: number

  /**
   * Maxkum number of selected entries (on multiple selection)
   */
  max?: number

  /**
   * Select options
   */
  options: (string|number)[]

  /** */
  constructor(def: Object) {
    super(def)
    this.multiple = has(def, 'multiple') && isTrue(def.multiple, false)
    this.options = has(def, 'options') && isArr(def.options) ? def.options : []
    if (this.multiple) {
      this.value = has(def, 'value') && isArr(def.value) ? def.value : []
      this.min = has(def, 'min') && isInt(def.min, 1, null, false) ? toInt(def.min) : undefined
      this.max = has(def, 'max') && isInt(def.max, 1, null, false) ? toInt(def.max) : undefined
    } else {
      this.value = has(def, 'value') ? toStr(def.value) : ''
    }
  }

  /**
   * Getter for value for use in post data
   */
  get(): string|string[] {
    if (this.multiple) {
      return this.value.map((entry: any) => toStr(entry))
    } else {
      return toStr(this.value)
    }
  }

  /** */
  toString(): string {
    const res = this.get()
    return isArr(res) ? res.toString() : toStr(res)
  }

  /**
   * Type- and required-validation
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validate(val: any) {
    if (isEmpty(this.value)) {
      if (this.required) {
        return this._setValid('required')
      }
    } else if (!inArr(this.value, this.options)) {
      return this._setValid('type')
    } else if (this.multiple) {
      if (this.min && !isInt(this.value.length, this.min)) {
        return this._setValid('min')
      } else if (this.max && !isInt(this.value.length, null, this.max)) {
        return this._setValid('max')
      }
    }
    return this._setValid()
  }
}