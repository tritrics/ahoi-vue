import { toKey } from '../../fn'
import BaseFieldsModel from './BaseFields'
import type { IBlockModel } from '../types'
import type { JSONObject } from '../../types'

/**
 * Model representing a block field.
 */
export default class BlockModel extends BaseFieldsModel implements IBlockModel {
  
  /**
   * Type
   */
  type: 'block' = 'block'

  /**
   * Blocktype
   */
  block: string

  /** */
  constructor(obj: JSONObject) {
    super(obj)
    this.block = toKey(obj.block)
  }

  /**
   * Helper to check, if this is a specific blocktype
   */
  is(block: string): boolean {
    return this.block === block
  }

  not(block: string): boolean {
    return this.block !== block
  }
}
