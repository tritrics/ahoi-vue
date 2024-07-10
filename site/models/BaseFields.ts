import { has } from '../../fn'
import BaseModel from './Base'
import { parse } from '../index'
import type { IBaseFieldsModel, IModelList } from '../types'
import type { JSONObject } from '../../types'

export default class BaseFieldsModel extends BaseModel implements IBaseFieldsModel {
  fields?: IModelList

  constructor(obj: JSONObject) {
    super(undefined)
    if (has(obj, 'fields')) {
      this.fields = parse(obj.fields)
    }
  }

  has(field: string): boolean {
    return this.fields !== undefined && has(this.fields, field)
  }
}