import BaseFieldsModel from './BaseFields'
import type { IUserModel } from './types'
import type { JSONObject } from '../../types'

export default class UserModel extends BaseFieldsModel implements IUserModel {
  type: 'user' = 'user'

  meta: Object
  
  constructor(obj: JSONObject) {
    super(obj)
    this.meta = obj.meta
  }
}