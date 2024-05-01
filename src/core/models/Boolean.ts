import { toBool } from '../../fn'
import BaseModel from './Base'
import type { ModelTypes, IBooleanModel } from '../types'
import type { JSONObject } from '../../types'

export default class BooleanModel extends BaseModel implements IBooleanModel {
  _type: ModelTypes = 'boolean'

  constructor(obj: JSONObject) {
    super(toBool(obj.value))
  }

  str(): string {
    return this.value ? 'true' : 'false'
  }

  is(val: any): boolean {
    return toBool(val) === this.value
  }

  isTrue(): boolean {
    return this.value === true
  }
  
  isFalse(): boolean {
    return this.value === false
  }
}