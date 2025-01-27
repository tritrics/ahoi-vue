import EntriesModel from '../data/EntriesModel'
import type { IFilesModel } from '../types'

/**
 * Model representing a list of files.
 */
export default class FilesModel extends EntriesModel implements IFilesModel {
  
  /**
   * Type
   */
  type: 'files' = 'files'
}