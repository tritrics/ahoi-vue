import { toNum, isInt, isNum } from '../../fn'
import BaseModel from './Base'
import { componentOptions } from '../index'
import type { INumberModel } from './types'
import type { IComponentOptions } from '../types'
import type { Object } from '../../types'

export default class NumberModel extends BaseModel implements INumberModel {
  type: 'number' = 'number'
  
  constructor(mixed: any) {
    super(toNum(mixed.value ?? mixed))
  }

  str(options: IComponentOptions = {}) {
    const fixed: number|undefined = componentOptions.get('fixed', options?.fixed)
    const stringOptions: Object = {}
    if (isInt(fixed, 1)) {
      stringOptions.minimumFractionDigits = fixed
      stringOptions.maximumFractionDigits = fixed
    }
    return this.value.toLocaleString(
      componentOptions.get('locale', options?.locale),
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