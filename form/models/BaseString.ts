import { has, isInt, isStr, toInt, isEmpty } from '../../fn'
import BaseModel from './Base'
import type { IFormBaseStringModel, IFormListModel } from '../types'
import type { Object } from '../../types'

/**
 * Base model for string models
 */
export default class BaseStringModel extends BaseModel implements IFormBaseStringModel {

  /**
   * Minimum length for text
   */
  minlength: number|null

  /**
   * Maximum length for text
   */
  maxlength: number|null

  /**
   * Allow line breaks, fixed to false
   */
  linebreaks: boolean = false

  /** */
  constructor(def: Object, parent?: IFormListModel) {
    super(def, parent)
    this.minlength = has(def, 'minlength') && isInt(def.minlength, 1, null, false) ? toInt(def.minlength) : null
    this.maxlength = has(def, 'maxlength') && isInt(def.maxlength, 1, null, false) ? toInt(def.maxlength) : null
  }

  /**
   * Type- and required-validation
   */
  validate() {
    if (isEmpty(this.value)) {
      if (this.required) {
        return this.setValid('required')
      }
    } else if(!isStr(this.value, null, null, this.linebreaks)) {
      return this.setValid('type')
    } else if(this.minlength && !isStr(this.value, this.minlength)) {
      return this.setValid('minlength')
    } else if(this.maxlength && !isStr(this.value, null, this.maxlength)) {
      return this.setValid('maxlength')
    }
    return this.setValid()
  }
}