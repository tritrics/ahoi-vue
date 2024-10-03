import { isTrue } from '../../utils'
import BaseModel from './Base'
import { globalStore } from '../../plugin'
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
    if(isTrue(options?.nl2br ?? globalStore.get('nl2br'))) {
      str = str.replace(/\n/mg, '<br />')
    }
    return str
  }
}