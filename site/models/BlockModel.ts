import { toKey } from '../../utils'
import FieldsModel from '../data/FieldsModel'
import type { IBlockModel } from '../types'
import type { JSONObject } from '../../types'

/**
 * Model representing a block field.
 */
export default class BlockModel extends FieldsModel implements IBlockModel {
  
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
   * Check, if this is a specific blocktype
   */
  is(block: string): boolean {
    return this.block === block
  }

  /**
   * Check, if it's not a specific blocktype.
   */
  isNot(block: string): boolean {
    return this.block !== block
  }
}
