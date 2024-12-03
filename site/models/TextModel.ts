import { isTrue } from '../../utils'
import BaseModel from '../data/BaseModel'
import { apiStore } from '../../plugin'
import type { ITextModel, ISiteOptions } from '../types'
import type { JSONObject } from '../../types'

/**
 * Model representing a text (multiline) field.
 */
export default class TextModel extends BaseModel implements ITextModel {
  
  /**
   * Type
   */
  type: 'text' = 'text'
  
  /** */
  constructor(obj: JSONObject) {
    super(obj.value)
  }
  
  /**
   * Getter for value as string
   */
  str(options: ISiteOptions = {}): string {
    let str: string = this.value
    if(isTrue(options?.nl2br ?? apiStore.get('nl2br'))) {
      str = str.replace(/\n/mg, '<br />')
    }
    return str
  }
}