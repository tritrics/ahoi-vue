import BaseEntriesModel from './BaseEntries'
import type { IPagesModel } from '../types'

/**
 * Model representing a list of pages.
 */
export default class PagesModel extends BaseEntriesModel implements IPagesModel {
  
  /**
   * Type
   */
  type: 'pages' = 'pages'
}