import { toNum, isInt, isNum } from '../../fn'
import BaseModel from './Base'
import { siteOptions } from '../index'
import type { INumberModel } from './types'
import type { IsiteOptions } from '../types'
import type { Object } from '../../types'

export default class NumberModel extends BaseModel implements INumberModel {
  type: 'number' = 'number'
  
  constructor(mixed: any) {
    super(toNum(mixed.value ?? mixed))
  }

  str(options: IsiteOptions = {}) {
    const fixed: number|undefined = siteOptions.get('fixed', options?.fixed)
    const stringOptions: Object = {}
    if (isInt(fixed, 1)) {
      stringOptions.minimumFractionDigits = fixed
      stringOptions.maximumFractionDigits = fixed
    }
    return this.value.toLocaleString(
      siteOptions.get('locale', options?.locale),
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