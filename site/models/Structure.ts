import BaseEntriesModel from './BaseEntries'
import type { IStructureModel } from '../types'

/**
 * Model representing a structure field.
 */
export default class StructureModel extends BaseEntriesModel implements IStructureModel {
  
  /**
   * Type
   */
  type: 'structure' = 'structure'
}
