import { has, isInt, isStr, toInt, isEmpty } from '../../utils'
import BaseModel from './Base'
import type { IFormBaseStringModel } from '../types'
import type { Object } from '../../types'

/**
 * Base model for string models
 */
export default class BaseStringModel extends BaseModel implements IFormBaseStringModel {

  /**
   * Allow line breaks, fixed to false
   */
  linebreaks: boolean = false
  
  /**
   * Minimum length for text
   */
  minlength: number|null = null

  /**
   * Maximum length for text
   */
  maxlength: number|null = null

  /** */
  constructor(def: Object) {
    super(def)
    if (has(def, 'minlength') && isInt(def.minlength, 1, null, false)) {
      this.minlength = toInt(def.minlength)
    }
    if (has(def, 'maxlength') && isInt(def.maxlength, 1, null, false)) {
      this.maxlength = toInt(def.maxlength)
    }
  }

  /**
   * Type- and required-validation
   */
  validate() {
    if (isEmpty(this.value)) {
      if (this.required) {
        return this._setValid('required')
      }
    } else if(!isStr(this.value, null, null, this.linebreaks)) {
      return this._setValid('type')
    } else if(this.minlength && !isStr(this.value, this.minlength)) {
      return this._setValid('minlength')
    } else if(this.maxlength && !isStr(this.value, null, this.maxlength)) {
      return this._setValid('maxlength')
    }
    return this._setValid()
  }
}