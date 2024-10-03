import { has, each, isStr, toKey } from '../../utils'
import BaseFieldsModel from './BaseFields'
import CollectionModel from './Collection'
import TranslationModel from './Translation'
import { parse } from '../index'
import { createLinkByValues } from './Link'
import type { IPageModel, ILinkModel, ICollectionModel, IFileModel, IPageMeta, ITranslationModel } from '../types'
import type { Object, JSONObject } from '../../types'

/**
 * Model representing a page field or the page request.
 */
export default class PageModel extends BaseFieldsModel implements IPageModel {
  
  /**
   * Type
   */
  type: 'page' = 'page'
  
  /**
   * Meta values
   */
  meta: IPageMeta

  /**
   * Link model
   */
  link: ILinkModel

  /**
   * List with link models for each language
   */
  translations?: ITranslationModel[]

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
    this.meta = obj.meta
    this.meta.blueprint = toKey(this.meta.blueprint)
    this.meta.modified = new Date(this.meta.modified)
    this.link = createLinkByValues('page', obj.meta.title, obj.meta.href)
    if (has(obj, 'translations')) {
      this.translations = []
      each(obj.translations, (translation: Object) => {
        this.translations!.push(new TranslationModel(translation))
      })
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
      return this.meta.blueprint === toKey(test)
    }
    return this.meta.blueprint
  }

  /** */
  toJSON() {
    return {
      type: this.type,
      meta: this.meta,
      link: this.link,
      translations: this.translations,
      fields: this.fields,
      collection: this.collection,
      entries: this.entries
    }
  }
}