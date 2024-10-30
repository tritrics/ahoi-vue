import { has, isObj } from '../../utils'
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
  meta?: Object
  
  /** */
  constructor(obj: JSONObject) {
    super(obj)
    if (isObj(obj.meta) && has(obj.meta, 'node')) {
      this.meta = obj.meta
    }
  }

  /**
   * Checking empty value.
   */
  isEmpty(): boolean {
    return ! isObj(this.meta)
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