import { toStr } from '../../utils'
import BaseModel from '../data/BaseModel'
import type { IMarkdownModel } from '../types'
import type { JSONObject } from '../../types'

/**
 * Model representing a markdown field.
 */
export default class MarkdownModel extends BaseModel implements IMarkdownModel {
  
  /**
   * Type
   */
  type: 'markdown' = 'markdown'
  
  /** */
  constructor(obj: JSONObject) {
    super(toStr(obj.value))
  }
}