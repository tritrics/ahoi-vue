import { toStr } from '../../fn'
import BaseModel from './Base'
import type { ModelTypes, IStringModel } from '../types'
import type { JSONObject } from '../../types'

export default class MarkdownModel extends BaseModel implements IStringModel {
  _type: ModelTypes = 'markdown'
  
  constructor(obj: JSONObject) {
    super(toStr(obj.value))
  }
}