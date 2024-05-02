import { has } from '../../fn'
import { parseModelsRec } from '../index'
import BaseModel from './Base'
import type { IBaseFieldsModel } from './types'
import type { JSONObject } from '../../types'

export default class BaseFieldsModel extends BaseModel implements IBaseFieldsModel {
  fields?: Object

  constructor(obj: JSONObject) {
    super(undefined)
    if (has(obj, 'fields')) {
      this.fields = parseModelsRec(obj.fields)
    }
  }

  has(field: string): boolean {
    return this.fields !== undefined && has(this.fields, field)
  }
}