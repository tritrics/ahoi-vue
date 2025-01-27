import { has, isObj } from '../../utils'
import BaseModel from './BaseModel'
import { parse } from '../index'
import type { IModelList, IFieldsModel } from '../types'
import type { JSONObject } from '../../types'

/**
 * Base model for models with fields.
 */
export default class FieldsModel extends BaseModel implements IFieldsModel {
  
  /**
   * Arrary with fields
   */
  fields?: IModelList

  /** */
  constructor(obj: JSONObject) {
    super(undefined)
    if (isObj(obj.fields)) {
      this.fields = parse(obj.fields)
    }
  }

  /**
   * Helper to check if a field exists
   */
  has(field: string): boolean {
    return this.fields !== undefined && has(this.fields, field)
  }
}