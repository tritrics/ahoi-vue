import BaseFieldsModel from './BaseFields'
import type { IPageMeta, ISiteModel } from '../types'
import type { JSONObject } from '../../types'

export default class SiteModel extends BaseFieldsModel implements ISiteModel {
  type: 'site' = 'site'
  
  meta: IPageMeta
  
  constructor(obj: JSONObject) {
    super(obj)
    this.meta = obj.meta
    this.meta.modified = new Date(this.meta.modified)
  }

  blueprint(): string {
    return this.meta.blueprint
  }

  toJSON() {
    return {
      type: this.type,
      meta: this.meta,
      fields: this.fields,
    }
  }
}