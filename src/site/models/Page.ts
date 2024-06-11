import { has, isTrue } from '../../fn'
import BaseFieldsModel from './BaseFields'
import CollectionModel from './Collection'
import { parse } from '../index'
import { createLinkByValues } from './Link'
import type { IPageModel, ILinkModel, ICollectionModel, IFileModel, IPageMeta } from './types'
import type { JSONObject } from '../../types'

export default class PageModel extends BaseFieldsModel implements IPageModel {
  type: 'page' = 'page'
  
  meta: IPageMeta

  link: ILinkModel

  collection?: ICollectionModel

  entries?: (IPageModel|IFileModel)[]
  
  constructor(obj: JSONObject) {
    super(obj)
    this.meta = obj.meta
    this.meta.modified = new Date(this.meta.modified)
    this.link = createLinkByValues('page', obj.meta.title, obj.meta.href)
    if (has(obj, 'collection')) {
      this.collection = new CollectionModel(obj.collection)
    }
    if (has(obj, 'entries')) {
      this.entries = parse(obj.entries) as (IPageModel|IFileModel)[]
    }
  }

  blueprint(): string {
    return this.meta.blueprint
  }

  isHome(): boolean {
    return isTrue(this.meta.home)
  }

  // ... more functions?
  
  get attr(): Object {
    return this.link.attr ?? {}
  }

  toJSON() {
    return {
      type: this.type,
      meta: this.meta,
      link: this.link,
      fields: this.fields,
      collection: this.collection,
      entries: this.entries
    }
  }
}