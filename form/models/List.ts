import { watchEffect } from 'vue'
import { has, each, unset, isInt, isArr, toInt, isEmpty } from '../../fn'
import BaseModel from './Base'
import StringModel from './String'
import type { IListModel, IStringModel } from './types'
import type { Object } from '../../types'

export default class ListModel extends BaseModel implements IListModel {
  type: 'list' = 'list'

  min: number|null

  max: number|null

  minlength: number|null

  maxlength: number|null

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validate(val?: any): void {
    each (this.value, (field: IStringModel) => {
      field.validate()
    })
    if (isEmpty(this.value)) {
      if (this.required) {
        return this.setValid('required')
      }
    } else if (!isArr(this.value)) {
      return this.setValid('type')
    } else if (this.min && !isInt(this.value.length, this.min)) {
      return this.setValid('min')
    } else if (this.max && !isInt(this.value.length, null, this.max)) {
      return this.setValid('max')
    }
    return this.setValid()
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

  delete(id?: string): void {
    for (let key = 0; key < this.value.length; key++) {
      if (this.value[key].id === id) {
        this.value[key].watch(false)
        unset(this.value, key)
        return
      }
    }
  }

  data() {
    return this.value.map((field: IStringModel) => field.data())
  }

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
    each(this.value, (field: IStringModel) => {
      field.watch(start)
    })
  }

  toString(): string {
    return this.data().toString()
  }
}