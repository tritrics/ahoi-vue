import BaseObjectModel from './BaseObject'
import type { IUserModel } from '../types'
import type { JSONObject } from '../../types'

/**
 * Model representing a user field.
 */
export default class UserModel extends BaseObjectModel implements IUserModel {

  /**
   * Type
   */
  type: 'user' = 'user'
  
  /** */
  constructor(obj: JSONObject) {
    super(obj)
  }
}