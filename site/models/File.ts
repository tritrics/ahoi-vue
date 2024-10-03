import { toInt } from '../../utils'
import BaseFieldsModel from './BaseFields'
import { createLinkByValues } from './Link'
import type { IFileModel, ILinkModel, IFileMeta, IImageMeta } from '../types'
import type { JSONObject } from '../../types'

/**
 * Model representing a file field.
 */
export default class FileModel extends BaseFieldsModel implements IFileModel {
  
  /**
   * Type
   */
  type: 'file' = 'file'
  
  /**
   * Object with meta data
   */
  meta: IFileMeta | IImageMeta

  /**
   * Link model to file
   */
  link: ILinkModel
  
  /** */
  constructor(obj: JSONObject) {
    super(obj)
    if (obj.meta.filetype === 'image') {
      obj.meta.width = toInt(obj.meta.width)
      obj.meta.height = toInt(obj.meta.height)
    }
    obj.meta.modified = new Date(obj.meta.modified)
    this.meta = obj.meta
    this.link = createLinkByValues('file', obj.meta.title, obj.meta.href)
  }

  /**
   * Flag to check, if file is an image
   */
  isImage(): boolean {
    return this.meta.filetype === 'image'
  }

  /** */
  toJSON() {
    return {
      type: this.type,
      meta: this.meta,
      link: this.link,
      fields: this.fields,
    }
  }
}