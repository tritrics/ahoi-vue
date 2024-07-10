import { has, isTrue } from '../../fn'
import BaseModel from './Base'
import { parse } from '../index'
import type { ILanguageModel, ILanguageMeta } from '../types'
import type { JSONObject } from '../../types'

/**
 * Model representing a language.
 */
export default class LanguageModel extends BaseModel implements ILanguageModel {
  
  /**
   * Type
   */
  type: 'language' = 'language'

  /**
   * Meta values
   */
  meta: ILanguageMeta

  /**
   * Fields (terms) of the language
   */
  fields?: Object
  
  /** */
  constructor(obj: JSONObject) {
    super(obj.meta.title)
    this.meta = obj.meta
    if (has(obj, 'fields')) {
      this.fields = parse(obj.fields)
    }
  }

  /**
   * Shortcut to get language code
   */
  get code(): string {
    return this.meta.code
  }

  /**
   * Flag to check, if this is the default language
   */
  isDefault(): boolean {
    return isTrue(this.meta.default)
  }

  /**
   * Helper to check if a field (term) exists
   */
  has(field: string): boolean {
    return this.fields !== undefined && has(this.fields, field)
  }
}
