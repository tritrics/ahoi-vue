import EntriesModel from '../data/EntriesModel'
import type { IPagesModel } from '../types'

/**
 * Model representing a list of pages.
 */
export default class PagesModel extends EntriesModel implements IPagesModel {
  
  /**
   * Type
   */
  type: 'pages' = 'pages'
}