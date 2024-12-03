import ObjectModel from '../data/ObjectModel'
import type { IUserModel } from '../types'
import type { JSONObject } from '../../types'

/**
 * Model representing a user field.
 */
export default class UserModel extends ObjectModel implements IUserModel {

  /**
   * Type
   */
  type: 'user' = 'user'
  
  /** */
  constructor(obj: JSONObject) {
    super(obj)
  }
}