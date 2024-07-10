import { toStr } from '../../fn'
import BaseModel from './Base'
import type { IMarkdownModel } from '../types'
import type { JSONObject } from '../../types'

export default class MarkdownModel extends BaseModel implements IMarkdownModel {
  type: 'markdown' = 'markdown'
  
  constructor(obj: JSONObject) {
    super(toStr(obj.value))
  }
}