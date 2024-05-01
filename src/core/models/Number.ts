import { toNum, isInt, isNum } from '../../fn'
import BaseModel from './Base'
import { coreOptions } from '../index'
import type { ModelTypes, INumberModel, ICoreOptions } from '../types'
import type { Object, JSONObject } from '../../types'

export default class NumberModel extends BaseModel implements INumberModel {
  _type: ModelTypes = 'number'
  
  constructor(obj: JSONObject) {
    super(toNum(obj.value))
  }

  str(options: ICoreOptions = {}) {
    const fixed: number|undefined = coreOptions.get('fixed', options?.fixed)
    const stringOptions: Object = {}
    if (isInt(fixed, 1)) {
      stringOptions.minimumFractionDigits = fixed
      stringOptions.maximumFractionDigits = fixed
    }
    return this.value.toLocaleString(
      coreOptions.get('locale', options?.locale),
      stringOptions
    )
  }

  isMin(min: number): boolean {
    return isNum(this.value, min, null, true)
  }

  isMax(max: number): boolean {
    return isNum(this.value, null, max, true)
  }

  isGreater(min: number): boolean {
    return isNum(this.value, min, null, false)
  }

  isSmaller(max: number): boolean {
    return isNum(this.value, null, max, false)
  }
  
  isBetween(min: number, max: number): boolean {
    return isNum(this.value, min, max)
  }
}