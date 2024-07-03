import { has, isNum, toNum, isEmpty} from '../../fn'
import BaseModel from './Base'
import type { INumberModel } from './types'
import type { FormPostValue } from "../types"
import type { Object } from '../../types'

export default class NumberModel extends BaseModel implements INumberModel {
  type: 'number' = 'number'

  min: number|null

  max: number|null

  constructor(def: Object) {
    super(def)
    this.min = has(def, 'min') && isNum(def.min, 1, null, false) ? toNum(def.min) : null
    this.max = has(def, 'max') && isNum(def.max, 1, null, false) ? toNum(def.max) : null
  }

  validate() {
    if (isEmpty(this.value)) {
      if (this.required) {
        return this.setValid('required')
      }
    } else if(!isNum(this.value, null, null, false)) {
      return this.setValid('type')
    } else if(this.min && !isNum(this.value, this.min, null, false)) {
      return this.setValid('min')
    } else if(this.max && !isNum(this.value, null, this.max, false)) {
      return this.setValid('max')
    }
    return this.setValid()
  }

  data(): FormPostValue {
    return toNum(this.value) as number|string
  }
}