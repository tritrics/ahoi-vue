import { has, isTrue, isBool } from '../../utils'
import BaseModel from './Base'
import type { IFormBooleanModel } from '../types'
import type { Object } from '../../types'

/**
 * Model to represent a boolean input (checkbox)
 */
export default class BooleanModel extends BaseModel implements IFormBooleanModel {

  /**
   * Type
   */
  type: 'boolean' = 'boolean'

  /** */
  constructor(def: Object) {
    super(def)
    this.value = has(def, 'value') && isTrue(def.value, false) ? true : false
  }

  /**
   * Getter for value for use in post data
   */
  get() {
    return isTrue(this.value, false) ? 1 : 0
  }
  
  /**
   * Type- and required-validation
   */
  validate() {
    if (this.required && !isTrue(this.value, false)) {
      return this._setValid('required')
    } else if (!isBool(this.value, false)) {
      return this._setValid('type')
    }
    return this._setValid()
  }
}