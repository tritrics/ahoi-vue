import { has, isTrue, isArr } from '../../utils'
import BaseModel from './Base'
import { parse } from '../index'
import type { IInfoModel, ILanguageModel, IInfoMeta } from '../types'
import type { JSONObject } from '../../types'

/**
 * Model representing the info request.
 */
export default class InfoModel extends BaseModel implements IInfoModel {
  
  /**
   * Type
   */
  type: 'info' = 'info'
  
  /**
   * Meta values
   */
  meta: IInfoMeta

  /**
   * Infos about API configuration (available requests)
   */
  interface: Object

  /**
   * Languages in multilanguage enviroments
   */
  languages?: ILanguageModel[]
  
  /** */
  constructor(obj: JSONObject) {
    super(undefined)
    this.meta = obj.meta
    this.interface = obj.interface
    if (has(obj, 'languages')) {
      this.languages = parse(obj.languages) as ILanguageModel[]
    }
  }

  /**
   * Flag to check, if it's a multilanguage enviroment
   */
  isMultilang(): boolean {
    return isTrue(this.meta.multilang)
  }

  /**
   * Helper to get default language
   */
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
