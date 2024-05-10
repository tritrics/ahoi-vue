import { isTrue } from '../../fn'
import BaseModel from './Base'
import { componentOptions } from '../index'
import type { ITextModel } from './types'
import type { IComponentOptions } from '../types'
import type { JSONObject } from '../../types'

export default class TextModel extends BaseModel implements ITextModel {
  type: 'text' = 'text'
  
  constructor(obj: JSONObject) {
    super(obj.value)
  }
  
  str(options: IComponentOptions = {}): string {
    let str: string = this.value

    if(isTrue(componentOptions.get('nl2br', options.nl2br))) {
      str = str.replace(/\n/mg, '<br />')
    }
    return str
  }
}