import BaseFieldsModel from './BaseFields'
import type { IPageMeta, ISiteModel } from '../types'
import type { JSONObject } from '../../types'

/**
 * Model representing the site request.
 */
export default class SiteModel extends BaseFieldsModel implements ISiteModel {
  
  /**
   * Type
   */
  type: 'site' = 'site'
  
  /**
   * Meta values
   */
  meta: IPageMeta
  
  /** */
  constructor(obj: JSONObject) {
    super(obj)
    this.meta = obj.meta
    this.meta.modified = new Date(this.meta.modified)
  }

  /** */
  toJSON() {
    return {
      type: this.type,
      meta: this.meta,
      fields: this.fields,
    }
  }
}