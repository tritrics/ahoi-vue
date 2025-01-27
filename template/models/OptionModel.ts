import { toStr, isStr, isNum, has } from '../../utils'
import BaseModel from '../data/BaseModel'
import type { IOptionModel } from '../types'
import type { JSONObject } from '../../types'

/**
 * Model representing a select options.
 */
export default class OptionModel extends BaseModel implements IOptionModel {
  
  /**
   * Type
   */
  type: 'option' = 'option'
  
  /**
   * Optional label
   */
  label?: string

  /** */
  constructor(obj: JSONObject) {
    const value: string|number = isStr(obj.value) || isNum(obj.value) ? obj.value : toStr(obj.value)
    super(value)
    if (has(obj, 'label')) {
      this.label = obj.label
    }
  }
}