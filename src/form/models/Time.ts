import { extend, has, toStr, isTrue, isDate, isEmpty, toDate, dateRegExp, dateToStr } from '../../fn'
import { createBase } from './index'
import type { Object, FormModel } from '../../types'

/**
 * Time field
 * Kirby: Time
 */
export default function createTime(def: Object): FormModel {
  const format: string = 'h:ii'
  const formatReg: RegExp = dateRegExp(format)
  const inject: Object = {
    type: 'time',
    value: has(def, 'value') ? toStr(def.value) : '',
    required: has(def, 'required') && isTrue(def.required) ? true : false,
    format: formatReg,
    min: has(def, 'min') && isDate(def.min, null, null, false, format) ? toDate(def.min, formatReg) : null,
    max: has(def, 'max') && isDate(def.max, null, null, false, format) ? toDate(def.max, formatReg) : null,
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
    },
    data() {
      const date = toDate(this.value, this.format)
      return date ? dateToStr(date, 'hh:ii') : ''
    },
  }
  return extend(createBase(), inject) as FormModel
}