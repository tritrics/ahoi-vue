import { toStr } from '../../utils'
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
}