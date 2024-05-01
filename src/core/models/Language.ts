import { has, isTrue } from '../../fn'
import BaseModel from './Base'
import { parseModelsRec } from '../index'
import type { ModelTypes, ILanguageModel, ILanguageMeta } from '../types'
import type { JSONObject } from '../../types'

export default class LanguageModel extends BaseModel implements ILanguageModel {
  _type: ModelTypes = 'language'
  
  meta: ILanguageMeta

  fields?: Object
  
  constructor(obj: JSONObject) {
    super(undefined)
    this.meta = obj.meta
    if (has(obj, 'fields')) {
      this.fields = parseModelsRec(obj.fields)
    }
  }

  code(): string {
    return this.meta.code
  }

  locale(): string {
    return this.meta.locale
  }

  title(): string {
    return this.meta.title
  }

  direction(): string {
    return this.meta.direction
  }

  isDefault(): boolean {
    return isTrue(this.meta.default)
  }

  has(field: string): boolean {
    return this.fields !== undefined && has(this.fields, field)
  }
}
