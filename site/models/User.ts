import BaseFieldsModel from './BaseFields'
import type { IUserModel } from '../types'
import type { JSONObject } from '../../types'

/**
 * Model representing a user field.
 */
export default class UserModel extends BaseFieldsModel implements IUserModel {

  /**
   * Type
   */
  type: 'user' = 'user'

  /**
   * Meta values
   */
  meta: Object
  
  /** */
  constructor(obj: JSONObject) {
    super(obj)
    this.meta = obj.meta
  }

  /** */
  toJSON() {
    return {
      type: this.type,
      meta: this.meta,
      fields: this.fields,
    }
  }
}