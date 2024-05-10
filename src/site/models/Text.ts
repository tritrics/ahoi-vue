import { isTrue } from '../../fn'
import BaseModel from './Base'
import { siteOptions } from '../index'
import type { ITextModel } from './types'
import type { IsiteOptions } from '../types'
import type { JSONObject } from '../../types'

export default class TextModel extends BaseModel implements ITextModel {
  type: 'text' = 'text'
  
  constructor(obj: JSONObject) {
    super(obj.value)
  }
  
  str(options: IsiteOptions = {}): string {
    let str: string = this.value

    if(isTrue(siteOptions.get('nl2br', options.nl2br))) {
      str = str.replace(/\n/mg, '<br />')
    }
    return str
  }
}