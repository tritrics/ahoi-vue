import { has } from '../../fn'
import BaseModel from './Base'
import { parseModelsRec } from '../index'
import { createLinkByValues } from './Link'
import type { ModelTypes, IFileModel, ILinkModel, IFileMeta } from '../types'
import type { JSONObject } from '../../types'

export default class FileModel extends BaseModel implements IFileModel {
  _type: ModelTypes = 'file'
  
  meta: IFileMeta

  link: ILinkModel

  fields?: Object
  
  constructor(obj: JSONObject) {
    super(undefined)
    this.meta = obj.meta
    this.meta.modified = new Date(this.meta.modified)
    this.link = createLinkByValues('page', obj.meta.title, obj.meta.href)
    if (has(obj, 'fields')) {
      this.fields = parseModelsRec(obj.fields)
    }
  }

  isImage(): boolean {
    return this.meta.filetype === 'image'
  }

  has(field: string): boolean {
    return this.fields !== undefined && has(this.fields, field)
  }
  
  attr(asString: boolean = false): string|Object {
    if (this.link !== undefined) {
      return this.link.attr(asString)
    }
    return asString ? '' : {}
  }

  // ... more functions?
}