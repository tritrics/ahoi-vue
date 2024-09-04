import { has, count, isArr } from '../../fn'
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
   * Number of entries
   */
  count(): number {
    return isArr(this.entries) ? count(this.entries) : 0
  }

  /**
   * Get the first element
   */
  first(): IBaseModel|undefined {
    if (has(this.entries, 0)) {
      return this.entries[0]
    }
  }

  /**
   * Check min. number of entries
   */
  has(count: number = 1): boolean {
    return this.count() >= count
  }
}