import { isEmpty, isEmail } from '../../fn'
import BaseModel from './Base'
import type { IFormEmailModel } from '../types'
import type { Object } from '../../types'

 /**
  * Model to represent a email input
  */
export default class EmailModel extends BaseModel implements IFormEmailModel {

  /**
   * Type
   */
  type: 'email' = 'email'

  /** */
  constructor(def: Object) {
    super(def)
  }

  /**
   * Type- and required-validation
   */
  validate() {
    if (isEmpty(this.value)) {
      if (this.required) {
        return this.setValid('required')
      }
    } else if(!isEmail(this.value)) {
      return this.setValid('type')
    }
    return this.setValid()
  }
}