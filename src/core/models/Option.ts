import { toStr, isStr, isNum, has } from '../../fn'
import BaseModel from './Base'
import StringModel from './String'
import type { ModelTypes, IOptionModel } from '../types'
import type { JSONObject } from '../../types'

export default class OptionModel extends BaseModel implements IOptionModel {
  _type: ModelTypes = 'option'
  
  label?: StringModel

  constructor(obj: JSONObject) {
    const value: string|number = isStr(obj.value) || isNum(obj.value) ? obj.value : toStr(obj.value)
    super(value)
    if (has(obj, 'label')) {
      this.label = new StringModel({ value: obj.label })
    }
  }
}