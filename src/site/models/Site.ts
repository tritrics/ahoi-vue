import { has } from '../../fn'
import BaseFieldsModel from './BaseFields'
import PageModel from './Page'
import type { IPageModel, IPageMeta, ISiteModel } from './types'
import type { JSONObject } from '../../types'

export default class SiteModel extends BaseFieldsModel implements ISiteModel {
  type: 'site' = 'site'
  
  meta: IPageMeta

  home?: IPageModel
  
  constructor(obj: JSONObject) {
    super(obj)
    this.meta = obj.meta
    if (has(obj, 'home')) {
      this.home = new PageModel(obj.home)
    }
    this.meta.modified = new Date(this.meta.modified)
  }

  blueprint(): string {
    return this.meta.blueprint
  }

  toJSON() {
    return {
      type: this.type,
      meta: this.meta,
      home: this.home,
      fields: this.fields,
    }
  }
}