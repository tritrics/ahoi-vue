import { truncate, toStr, isInt } from '../../utils'
import BaseModel from '../data/BaseModel'
import type { IStringModel } from '../types'

/**
 * Model representing a string field.
 */
export default class StringModel extends BaseModel implements IStringModel {
  
  /**
   * Type
   */
  type: 'string' = 'string'
  
  /** */
  constructor(mixed: any) {
    super(toStr(mixed.value ?? mixed))
  }

  /**
   * Truncate string
   */
  truncate(length: number, ellipsis: string = '...'): string {
    if (isInt(length, 1)) {
      return truncate(this.value, length, ellipsis)
    }
    return toStr(this.value)
  }
}