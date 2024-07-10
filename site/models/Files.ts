import BaseEntriesModel from './BaseEntries'
import type { IFilesModel } from '../types'

/**
 * Model representing a list of files.
 */
export default class FilesModel extends BaseEntriesModel implements IFilesModel {
  
  /**
   * Type
   */
  type: 'files' = 'files'
}