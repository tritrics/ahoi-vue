import { isEmpty, isEmail } from '../../utils'
import BaseModel from './Base'
import type { IFormEmailModel } from '../types'

 /**
  * Model to represent a email input
  */
export default class EmailModel extends BaseModel implements IFormEmailModel {

  /**
   * Type
   */
  type: 'email' = 'email'

  /**
   * Type- and required-validation
   */
  validate() {
    if (isEmpty(this.value)) {
      if (this.required) {
        return this._setValid('required')
      }
    } else if(!isEmail(this.value)) {
      return this._setValid('type')
    }
    return this._setValid()
  }
}