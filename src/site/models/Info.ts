import { has, isTrue, isArr } from '../../fn'
import BaseModel from './Base'
import { parseModelsRec } from '../index'
import type { IInfoModel, ILanguageModel, IInfoMeta, ISiteModel } from './types'
import type { JSONObject } from '../../types'

export default class InfoModel extends BaseModel implements IInfoModel {
  type: 'info' = 'info'
  
  meta: IInfoMeta

  interface: Object

  languages?: ILanguageModel[]

  sites?: ISiteModel[]

  site?: ISiteModel
  
  constructor(obj: JSONObject) {
    super(undefined)
    this.meta = obj.meta
    this.interface = obj.interface
    if (has(obj, 'languages')) {
      this.languages = parseModelsRec(obj.languages) as ILanguageModel[]
    }
    if (has(obj, 'sites')) {
      this.sites = parseModelsRec(obj.sites) as ISiteModel[]
    }
    if (has(obj, 'site')) {
      this.site = parseModelsRec(obj.site) as ISiteModel
    }
  }

  isMultilang(): boolean {
    return isTrue(this.meta.multilang)
  }

  defaultLang(): string|null {
    if (isArr(this.languages)) {
      for (let i = 0; i < this.languages.length; i++) {
        if (isTrue(this.languages[i].isDefault())) {
          return this.languages![i].code
        }
      }
    }
    return null
  }
}
