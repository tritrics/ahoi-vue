import { has } from '../../fn'
import { parse } from '../index'
import BaseModel from './Base'
import type { IBaseModel, IBaseEntriesModel } from '../types'
import type { JSONObject } from '../../types'

/**
 * Base model for models with entries.
 */
export default class BaseEntriesModel extends BaseModel implements IBaseEntriesModel {

  /**
   * Array with entries
   */
  entries: IBaseModel[]

  /** */
  constructor(obj: JSONObject) {
    super(undefined)
    this.entries = parse(obj.entries) as BaseModel[]
  }

  /**
   * Helper to get the first element
   */
  first(): IBaseModel|undefined {
    if (has(this.entries, 0)) {
      return this.entries[0]
    }
  }
}