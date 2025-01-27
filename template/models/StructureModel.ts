import EntriesModel from '../data/EntriesModel'
import type { IStructureModel } from '../types'

/**
 * Model representing a structure field.
 */
export default class StructureModel extends EntriesModel implements IStructureModel {
  
  /**
   * Type
   */
  type: 'structure' = 'structure'
}
