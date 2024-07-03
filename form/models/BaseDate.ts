import { has, isStr, dateRegExp, isEmpty, isDate, toDate } from '../../fn'
import BaseModel from './Base'
import type { IBaseDateModel } from './types'
import type { Object } from '../../types'

export default class BaseDateModel extends BaseModel implements IBaseDateModel {
  format: string

  formatReg: RegExp

  min: Date|null

  max: Date|null

  constructor(def: Object) {
    super(def)
    this.format = has(def, 'format') && isStr(def.format, 1) ? def.format : 'yyyy-mm-dd'
    this.formatReg = dateRegExp(this.format)
    this.min = has(def, 'min') && isDate(def.min, null, null, false, this.format) ? toDate(def.min, this.formatReg) : null
    this.max = has(def, 'max') && isDate(def.max, null, null, false, this.format) ? toDate(def.max, this.formatReg) : null
  }
  
  validate() {
    if (isEmpty(this.value)) {
      if (this.required) {
        return this.setValid('required')
      }
    } else if(!isDate(this.value, null, null, false, this.format)) {
      return this.setValid('type')
    } else if(this.min && !isDate(this.value, this.min, null, false, this.format)) {
      return this.setValid('min')
    } else if(this.max && !isDate(this.value, null, this.max, false, this.format)) {
      return this.setValid('max')
    }
    return this.setValid()
  }
}