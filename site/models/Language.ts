import { has, isTrue } from '../../fn'
import BaseModel from './Base'
import { parse } from '../index'
import type { ILanguageModel, ILanguageMeta } from './types'
import type { JSONObject } from '../../types'

export default class LanguageModel extends BaseModel implements ILanguageModel {
  type: 'language' = 'language'
  
  meta: ILanguageMeta

  fields?: Object
  
  constructor(obj: JSONObject) {
    super(obj.meta.title)
    this.meta = obj.meta
    if (has(obj, 'fields')) {
      this.fields = parse(obj.fields)
    }
  }

  get code(): string {
    return this.meta.code
  }

  isDefault(): boolean {
    return isTrue(this.meta.default)
  }

  has(field: string): boolean {
    return this.fields !== undefined && has(this.fields, field)
  }
}
