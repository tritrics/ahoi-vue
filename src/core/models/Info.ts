import { has, isTrue, isArr } from '../../fn'
import BaseModel from './Base'
import { parseModelsRec } from '../index'
import type { ModelTypes, IInfoModel, ILanguageModel, IInfoMeta } from '../types'
import type { JSONObject } from '../../types'

export default class InfoModel extends BaseModel implements IInfoModel {
  _type: ModelTypes = 'info'
  
  meta: IInfoMeta

  interface: Object

  languages?: ILanguageModel[]
  
  constructor(obj: JSONObject) {
    super(undefined)
    this.meta = obj.meta
    this.interface = obj.interface
    if (has(obj, 'languages')) {
      this.languages = parseModelsRec(obj.languages) as ILanguageModel[]
    }
  }

  isMultilang(): boolean {
    return isTrue(this.meta.multilang)
  }

  defaultLang(): string|null {
    if (isArr(this.languages)) {
      for (let i = 0; i < this.languages.length; i++) {
        if (isTrue(this.languages[i].isDefault())) {
          return this.languages![i].code()
        }
      }
    }
    return null
  }
}
