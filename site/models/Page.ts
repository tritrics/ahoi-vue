import { has, isStr, toKey } from '../../utils'
import BaseObjectModel from './BaseObject'
import CollectionModel from './Collection'
import { parse } from '../index'
import type { IPageModel, ICollectionModel, IFileModel } from '../types'
import type { JSONObject } from '../../types'

/**
 * Model representing a page field or the page request.
 */
export default class PageModel extends BaseObjectModel implements IPageModel {
  
  /**
   * Type
   */
  type: 'page' = 'page'

  /**
   * Collection model with information about entries
   */
  collection?: ICollectionModel

  /**
   * Optional child pages or files
   */
  entries?: (IPageModel|IFileModel)[]
  
  /** */
  constructor(obj: JSONObject) {
    super(obj)
    if (isStr(this.meta?.blueprint, 1)) {
      this.meta.blueprint = toKey(this.meta!.blueprint)
    }
    if (has(obj, 'collection')) {
      this.collection = new CollectionModel(obj.collection)
    }
    if (has(obj, 'entries')) {
      this.entries = parse(obj.entries) as (IPageModel|IFileModel)[]
    }
  }

  /**
   * Get blueprint or optionally test against given string.
   */
  blueprint(test?: string): string|boolean {
    if (isStr(test, 1)) {
      return this.meta?.blueprint === toKey(test)
    }
    return this.meta?.blueprint ?? ''
  }
}