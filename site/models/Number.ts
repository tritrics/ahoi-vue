import { toNum, isInt, isNum, toInt } from '../../utils'
import BaseModel from './Base'
import { globalStore } from '../../plugin'
import type { INumberModel, ISiteOptions } from '../types'
import type { Object } from '../../types'

/**
 * Model representing a number field.
 */
export default class NumberModel extends BaseModel implements INumberModel {
  
  /**
   * Type
   */
  type: 'number' = 'number'
  
  /** */
  constructor(mixed: any) {
    super(toNum(mixed.value ?? mixed))
  }

  /**
   * Getter for value as string
   */
  str(options: ISiteOptions = {}) {
    const fixed: number|undefined = isInt(options.fixed, 1) ? toInt(options.fixed) : undefined
    const stringOptions: Object = {}
    if (isInt(fixed, 1)) {
      stringOptions.minimumFractionDigits = fixed
      stringOptions.maximumFractionDigits = fixed
    }
    return this.value.toLocaleString(
      options?.locale ?? globalStore.get('locale'),
      stringOptions
    )
  }

  /**
   * Check if value is smaller or equal than a given value
   */
  isMin(min: number): boolean {
    return isNum(this.value, min, null, true)
  }

  /**
   * Check if value is greater or equal than a given value
   */
  isMax(max: number): boolean {
    return isNum(this.value, null, max, true)
  }

  /**
   * Check if value is greater than a given value
   */
  isGreater(min: number): boolean {
    return isNum(this.value, min, null, false)
  }

  /**
   * Check if value is smaller than a given value
   */
  isSmaller(max: number): boolean {
    return isNum(this.value, null, max, false)
  }

  /**
   * Check if value is between two a given values
   */
  isBetween(min: number, max: number): boolean {
    return isNum(this.value, min, max)
  }
}