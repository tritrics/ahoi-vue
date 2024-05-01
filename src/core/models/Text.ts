import { isTrue } from '../../fn'
import BaseModel from './Base'
import { coreOptions } from '../index'
import type { ModelTypes, IStringModel, ICoreOptions } from '../types'

export default class TextModel extends BaseModel implements IStringModel {
  _type: ModelTypes = 'text'
  
  str(options: ICoreOptions = {}): string {
    let str: string = this.value

    if(isTrue(coreOptions.get('nl2br', options.nl2br))) {
      str = str.replace(/\n/mg, '<br />')
    }
    return str
  }
}