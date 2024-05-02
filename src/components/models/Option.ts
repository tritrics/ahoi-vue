import { toStr, isStr, isNum, has } from '../../fn'
import BaseModel from './Base'
import type { IOptionModel } from './types'
import type { JSONObject } from '../../types'

export default class OptionModel extends BaseModel implements IOptionModel {
  type: 'option' = 'option'
  
  label?: string

  constructor(obj: JSONObject) {
    const value: string|number = isStr(obj.value) || isNum(obj.value) ? obj.value : toStr(obj.value)
    super(value)
    if (has(obj, 'label')) {
      this.label = obj.label
    }
  }
}