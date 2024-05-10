import { has, isTrue, isEmpty, isDate, toDate, dateToStr } from '../../fn'
import BaseDateModel from './BaseDate'
import type { IDateModel } from './types'
import type { Object } from '../../types'

export default class DateModel extends BaseDateModel implements IDateModel {
  type: 'date' = 'date'

  time: boolean

  constructor(def: Object) {
    super(def)
    this.time = has(def, 'time') && isTrue(def.time)
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

  data() {
    const date = toDate(this.value, this.format)
    return date ? dateToStr(date, 'yyyy-mm-dd hh:ii') : ''
  }
}