import { isTrue, isArr } from '../../utils'
import ObjectModel from '../data/ObjectModel'
import type { IInfoModel } from '../types'
import type { JSONObject } from '../../types'

/**
 * Model representing the info request.
 */
export default class InfoModel extends ObjectModel implements IInfoModel {
  
  /**
   * Type
   */
  type: 'info' = 'info'

  /**
   * Infos about API configuration (available requests)
   */
  interface: Object
  
  /** */
  constructor(obj: JSONObject) {
    super(obj)
    this.interface = obj.interface
  }

  /**
   * Flag to check, if it's a multilanguage enviroment
   */
  isMultilang(): boolean {
    return isTrue(this.meta?.multilang)
  }

  /**
   * Helper to get default language
   */
  defaultLang(): string|null {
    if (isArr(this.languages)) {
      for (let i = 0; i < this.languages.length; i++) {
        if (isTrue(this.languages[i].isDefault())) {
          return this.languages![i].get()
        }
      }
    }
    return null
  }
}
