import { has, isTrue, isInt, toInt, isArr, toStr, isEmpty, inArr } from '../../fn'
import BaseModel from './Base'
import type { ISelectModel } from './types'
import type { Object } from '../../types'

export default class SelectModel extends BaseModel implements ISelectModel {
  type: 'select' = 'select'

  multiple: boolean

  min?: number

  max?: number

  options: (string|number)[]

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validate(val: any) {
    if (isEmpty(this.value)) {
      if (this.required) {
        return this.setValid('required')
      }
    } else if (!inArr(this.value, this.options)) {
      return this.setValid('type')
    } else if (this.multiple) {
      if (this.min && !isInt(this.value.length, this.min)) {
        return this.setValid('min')
      } else if (this.max && !isInt(this.value.length, null, this.max)) {
        return this.setValid('max')
      }
    }
    return this.setValid()
  }

  data(): string|string[] {
    if (this.multiple) {
      return this.value.map((entry: any) => toStr(entry))
    } else {
      return toStr(this.value)
    }
  }

  toString(): string {
    const res = this.data()
    return isArr(res) ? res.toString() : toStr(res)
  }
}