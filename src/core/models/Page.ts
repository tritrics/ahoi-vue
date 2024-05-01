import { has, isTrue } from '../../fn'
import BaseModel from './Base'
import CollectionModel from './Collection'
import { parseModelsRec } from '../index'
import { createLinkByValues } from './Link'
import type { ModelTypes, IPageModel, ILinkModel, ICollectionModel, IFileModel, IPageMeta } from '../types'
import type { JSONObject } from '../../types'

export default class PageModel extends BaseModel implements IPageModel {
  _type: ModelTypes = 'page'
  
  meta: IPageMeta

  link: ILinkModel

  fields?: Object

  collection?: ICollectionModel

  entries?: (IPageModel|IFileModel)[]
  
  constructor(obj: JSONObject) {
    super(undefined)
    this.meta = obj.meta
    this.meta.modified = new Date(this.meta.modified)
    this.link = createLinkByValues('page', obj.meta.title, obj.meta.href)
    if (has(obj, 'fields')) {
      this.fields = parseModelsRec(obj.fields)
    }
    if (has(obj, 'collection')) {
      this.collection = new CollectionModel(obj.collection)
    }
    if (has(obj, 'entries')) {
      this.entries = parseModelsRec(obj.entries) as (IPageModel|IFileModel)[]
    }
  }

  blueprint(): string {
    return this.meta.blueprint
  }

  isHome(): boolean {
    return isTrue(this.meta.home)
  }

  // ... more functions?

  has(field: string): boolean {
    return this.fields !== undefined && has(this.fields, field)
  }
  
  attr(asString: boolean = false): string|Object {
    if (this.link !== undefined) {
      return this.link.attr(asString)
    }
    return asString ? '' : {}
  }
}