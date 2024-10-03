import { toBool } from '../../utils'
import BaseModel from './Base'
import type { IBooleanModel } from '../types'

/**
 * Model representing a boolean field (toggle).
 */
export default class BooleanModel extends BaseModel implements IBooleanModel {
  
  /**
   * Type
   */
  type: 'boolean' = 'boolean'

  /** */
  constructor(mixed: any) {
    super(toBool(mixed.value ?? mixed))
  }

  /**
   * Getter for value as string
   */
  str(): string {
    return this.value ? 'true' : 'false'
  }

  /**
   * Helper to compare value
   */
  is(val: any): boolean {
    return toBool(val) === this.value
  }

  /**
   * Helper to compare value
   */
  isNot(val: any): boolean {
    return toBool(val) !== this.value
  }

  /**
   * Checking a boolean value.
   */
  isFalse(): boolean {
    return this.value === false
  }

  /**
   * Checking a boolean value.
   */
  isTrue(): boolean {
    return this.value === true
  }
}