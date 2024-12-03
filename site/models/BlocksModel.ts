import EntriesModel from '../data/EntriesModel'
import type { IBlocksModel } from '../types'

/**
 * Model representing a structure field.
 */
export default class BlocksModel extends EntriesModel implements IBlocksModel {
  
  /**
   * Type
   */
  type: 'blocks' = 'blocks'
}
