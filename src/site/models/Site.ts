import { has, each } from '../../fn'
import BaseFieldsModel from './BaseFields'
import PageModel from './Page'
import type { IPageModel, IPageMeta, ISiteModel } from './types'
import type { Object, JSONObject } from '../../types'

export default class SiteModel extends BaseFieldsModel implements ISiteModel {
  type: 'site' = 'site'
  
  meta: IPageMeta

  home: IPageModel
  
  constructor(obj: JSONObject) {
    super(obj)
    this.meta = obj.meta
    this.home = new PageModel(obj.home)
    this.meta.modified = new Date(this.meta.modified)
  }

  blueprint(): string {
    return this.meta.blueprint
  }

  toJSON() {
    return {
      type: this.type,
      meta: this.meta,
      translations: this.translations,
      home: this.home,
      fields: this.fields,
    }
  }
}