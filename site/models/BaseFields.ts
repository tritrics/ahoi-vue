import { has, count, isObj } from '../../utils'
import BaseModel from './Base'
import { parse } from '../index'
import type { IBaseFieldsModel, IModelList } from '../types'
import type { JSONObject } from '../../types'

/**
 * Base model for models with fields.
 */
export default class BaseFieldsModel extends BaseModel implements IBaseFieldsModel {
  
  /**
   * Arrary with fields
   */
  fields?: IModelList

  /** */
  constructor(obj: JSONObject) {
    super(undefined)
    if (has(obj, 'fields')) {
      this.fields = parse(obj.fields)
    }
  }

  /**
   * Helper to check if a field exists
   */
  has(field: string): boolean {
    return this.fields !== undefined && has(this.fields, field)
  }

  /**
   * Checking empty field object.
   */
  isEmpty(): boolean {
    return !(isObj(this.fields) && count(this.fields) > 0)
  }
}