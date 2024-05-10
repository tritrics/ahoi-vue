import { has, isTrue, isBool } from '../../fn'
import BaseModel from './Base'
import type { IBooleanModel } from './types'
import type { Object } from '../../types'

export default class BooleanModel extends BaseModel implements IBooleanModel {
  type: 'boolean' = 'boolean'

  constructor(def: Object) {
    super(def)
    this.value = has(def, 'value') && isTrue(def.value, false) ? true : false
  }
  
  validate() {
    if (this.required && !isTrue(this.value, false)) {
      return this.setValid('required')
    } else if (!isBool(this.value, false)) {
      return this.setValid('type')
    }
    return this.setValid()
  }

  data() {
    return isTrue(this.value, false) ? 1 : 0
  }
}