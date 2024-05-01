import ObjectModel from './Object'
import type { ModelTypes, IObjectModel } from '../types'
import type { JSONObject } from '../../types'

export default class UserModel extends ObjectModel implements IObjectModel {
  _type: ModelTypes = 'user'
  
  constructor(obj: JSONObject) {
    super(obj)
  }
}