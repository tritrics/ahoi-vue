import BaseEntriesModel from './BaseEntries'
import type { IFilesModel } from '../types'

export default class FilesModel extends BaseEntriesModel implements IFilesModel {
  type: 'files' = 'files'
}