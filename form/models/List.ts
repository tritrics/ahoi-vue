import { watchEffect } from 'vue'
import { has, each, unset, isInt, isArr, toInt, isEmpty } from '../../fn'
import BaseModel from './Base'
import StringModel from './String'
import type { IFormListModel, IFormStringModel } from '../types'
import type { Object } from '../../types'

 /**
  * Model to represent a list input (set of text inputs)
  */
export default class ListModel extends BaseModel implements IFormListModel {

  /**
   * Type
   */
  type: 'list' = 'list'

  /**
   * Minimum number of entries
   */
  min: number|null

  /**
   * Maximum number of entires
   */
  max: number|null

  /**
   * Minimum length for text inputs (childs)
   */
  minlength: number|null

  /**
   * Maximum length for text inputs (childs)
   */
  maxlength: number|null

  /** */
  constructor(def: Object) {
    super(def)
    this.min = has(def, 'min') && isInt(def.min, 1, null, false) ? toInt(def.min) : null
    this.max = has(def, 'max') && isInt(def.max, 1, null, false) ? toInt(def.max) : null
    this.minlength = has(def, 'minlength') && isInt(def.minlength, 1, null, false) ? toInt(def.minlength) : null
    this.maxlength = has(def, 'maxlength') && isInt(def.maxlength, 1, null, false) ? toInt(def.maxlength) : null

    // adding models to value    
    let values: Array<string> = isArr(def.value) ? def.value : []
    if (isInt(this.min, 1) && values.length < this.min) {
      values = values.concat(Array.from({ length: this.min - values.length }, () => ''))
    } else if (isInt(this.max, 1) && values.length > this.max) {
      values = values.slice(0, this.max)
    }
    this.value = []
    each(values, (value: string) => {
      this.add(value)
    })
  }

  /**
   * Add a string value to list.
   */
  add(value: string = ''): void {
    const def: Object = {
      value: value,
      required: true,
      minlength: this.minlength,
      maxlength: this.maxlength,
    }
    this.value.push(new StringModel(def, this))
  }

  /**
   * Delete a child
   */
  delete(id?: string): void {
    for (let key = 0; key < this.value.length; key++) {
      if (this.value[key].id === id) {
        this.value[key].watch(false)
        unset(this.value, key)
        return
      }
    }
  }

  /**
   * Getter for value for use in post data
   */
  get() {
    return this.value.map((field: IFormStringModel) => field.get())
  }

  /** */
  toString(): string {
    return this.get().toString()
  }

  /**
   * Type- and required-validation
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validate(val?: any): void {
    each (this.value, (field: IFormStringModel) => {
      field.validate()
    })
    if (isEmpty(this.value)) {
      if (this.required) {
        return this._setValid('required')
      }
    } else if (!isArr(this.value)) {
      return this._setValid('type')
    } else if (this.min && !isInt(this.value.length, this.min)) {
      return this._setValid('min')
    } else if (this.max && !isInt(this.value.length, null, this.max)) {
      return this._setValid('max')
    }
    return this._setValid()
  }

  /**
   * Watcher to start validation
   */
  watch(start = true): void {
    if (start) {
      if(this.stop === null) {
        this.stop = watchEffect(() => {
          this.validate(this.value) // important to kick off the watchEffect
        })
      }
    } else if (this.stop !== null) {
      this.stop()
      this.stop = null
    }
    each(this.value, (field: IFormStringModel) => {
      field.watch(start)
    })
  }
}