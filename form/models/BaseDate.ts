import { has, isStr, dateRegExp, isEmpty, isDate, toDate } from '../../utils'
import BaseModel from './Base'
import type { IFormBaseDateModel } from '../types'
import type { Object } from '../../types'

/**
 * Base model for date models
 */
export default class BaseDateModel extends BaseModel implements IFormBaseDateModel {

  /**
   * Date format of the user input
   */
  format: string

  /**
   * Regular expression to convert the user input to date
   */
  formatReg: RegExp

  /**
   * Minium (earliest) date
   */
  min: Date|null

  /**
   * Maximum (latest) date
   */
  max: Date|null
  
  /** */
  constructor(def: Object) {
    super(def)
    this.format = has(def, 'format') && isStr(def.format, 1) ? def.format : 'yyyy-mm-dd'
    this.formatReg = dateRegExp(this.format)
    this.min = has(def, 'min') && isDate(def.min, null, null, false, this.format) ? toDate(def.min, this.formatReg) : null
    this.max = has(def, 'max') && isDate(def.max, null, null, false, this.format) ? toDate(def.max, this.formatReg) : null
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