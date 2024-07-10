import { has, isTrue, isEmpty, isDate, toDate, dateToStr } from '../../fn'
import BaseDateModel from './BaseDate'
import type { IFormDateModel } from '../types'
import type { Object } from '../../types'

 /**
  * Model to represent a date input
  */
export default class DateModel extends BaseDateModel implements IFormDateModel {

  /**
   * Type
   */
  type: 'date' = 'date'

  /**
   * Addition time value
   */
  time: boolean

  /** */
  constructor(def: Object) {
    super(def)
    this.time = has(def, 'time') && isTrue(def.time)
  }

  /**
   * Getter for value for use in post data
   */
  get() {
    const date = toDate(this.value, this.format)
    return date ? dateToStr(date, 'yyyy-mm-dd hh:ii') : ''
  }
  
  /**
   * Type- and required-validation
   */
  validate() {
    if (isEmpty(this.value)) {
      if (this.required) {
        return this._setValid('required')
      }
    } else if(!isDate(this.value, null, null, false, this.format)) {
      return this._setValid('type')
    } else if(this.min && !isDate(this.value, this.min, null, false, this.format)) {
      return this._setValid('min')
    } else if(this.max && !isDate(this.value, null, this.max, false, this.format)) {
      return this._setValid('max')
    }
    return this._setValid()
  }
}