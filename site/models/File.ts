import { toInt } from '../../utils'
import BaseObjectModel from './BaseObject'
import type { IFileModel } from '../types'
import type { JSONObject } from '../../types'

/**
 * Model representing a file field.
 */
export default class FileModel extends BaseObjectModel implements IFileModel {
  
  /**
   * Type
   */
  type: 'file' = 'file'
  
  /** */
  constructor(obj: JSONObject) {
    super(obj)
    if (this.meta?.filetype === 'image') {
      this.meta.width = toInt(this.meta.width)
      this.meta.height = toInt(this.meta.height)
    }
  }

  /**
   * Flag to check, if file is an image
   */
  isImage(): boolean {
    return this.meta?.filetype === 'image'
  }
}