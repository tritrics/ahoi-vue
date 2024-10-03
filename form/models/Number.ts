import { has, isNum, toNum, isEmpty } from '../../utils'
import BaseModel from './Base'
import type { IFormNumberModel, FormPostValue } from '../types'
import type { Object } from '../../types'

 /**
  * Model to represent a number input
  */
export default class NumberModel extends BaseModel implements IFormNumberModel {

  /**
   * Type
   */
  type: 'number' = 'number'

  /**
   * Minium number
   */
  min: number|null

  /**
   * Maximum number
   */
  max: number|null

  /**
   * Step (1 = integer)
   */
  step: number|null

  /** */
  constructor(def: Object) {
    super(def)
    this.min = has(def, 'min') && isNum(def.min, null, null, false) ? toNum(def.min) : null
    this.max = has(def, 'max') && isNum(def.max, null, null, false) ? toNum(def.max) : null
    this.step = has(def, 'step') && isNum(def.step, 0, null, false) ? toNum(def.step) : null
  }

  /**
   * Getter for value for use in post data
   */
  get(): FormPostValue {
    return toNum(this.value) as number|string
  }

  /**
   * Type- and required-validation
   */
  validate() {
    if (isEmpty(this.value)) {
      if (this.required) {
        return this._setValid('required')
      }
    } else if(!isNum(this.value, null, null, false)) {
      return this._setValid('type')
    } else if(this.min && !isNum(this.value, this.min, null, false)) {
      return this._setValid('min')
    } else if(this.max && !isNum(this.value, null, this.max, false)) {
      return this._setValid('max')
    } else if(this.step !== null) {
      const num = toNum(this.value) as number * (1 / this.step) // this.number % this.step has rounding problems!!!
      if (num % 1 !== 0) {
        return this._setValid('step')
      }
    }
    return this._setValid()
  }
}