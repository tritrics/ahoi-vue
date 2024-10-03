import { isEmpty, isUrl } from '../../utils'
import BaseModel from './Base'
import type { IFormUrlModel } from '../types'

 /**
  * Model to represent an url input
  */
export default class UrlModel extends BaseModel implements IFormUrlModel {

  /**
   * Type
   */
  type: 'url' = 'url'

  /**
   * Type- and required-validation
   */
  validate() {
    if (isEmpty(this.value)) {
      if (this.required) {
        return this._setValid('required')
      }
    } else if(!isUrl(this.value)) {
      return this._setValid('type')
    }
    return this._setValid()
  }
}