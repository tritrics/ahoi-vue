import { has, isTrue, toStr } from '../../utils'
import BaseObjectModel from './BaseObject'
import type { ILanguageModel } from '../types'
import type { JSONObject } from '../../types'

/**
 * Model representing a language.
 */
export default class LanguageModel extends BaseObjectModel implements ILanguageModel {
  
  /**
   * Type
   */
  type: 'language' = 'language'
  
  /** */
  constructor(obj: JSONObject) {
    super(obj)
  }

  /**
   * Flag to check, if this is the default language
   */
  isDefault(): boolean {
    return isTrue(this.meta?.default)
  }

  /**
   * Getter for (raw) value
   */
  get(): any {
    return toStr(this.meta?.lang)
  }

  /**
   * Helper to check if a field (term) exists
   */
  has(field: string): boolean {
    return this.fields !== undefined && has(this.fields, field)
  }

  /**
   * Getter for value as string
   */
  str(): string {
    return toStr(this.meta?.title)
  }
}
