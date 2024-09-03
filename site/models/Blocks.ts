import BaseEntriesModel from './BaseEntries'
import type { IBlocksModel } from '../types'

/**
 * Model representing a structure field.
 */
export default class BlocksModel extends BaseEntriesModel implements IBlocksModel {
  
  /**
   * Type
   */
  type: 'blocks' = 'blocks'
}
