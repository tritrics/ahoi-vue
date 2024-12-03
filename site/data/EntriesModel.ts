import { has, count, isArr } from '../../utils'
import { parse } from '../index'
import BaseModel from './BaseModel'
import type { IBaseModel, IEntriesModel } from '../types'
import type { JSONObject } from '../../types'

/**
 * Base model for models with entries.
 */
export default class EntriesModel extends BaseModel implements IEntriesModel {

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
    return this.nth(0)
  }

  /**
   * Check entry by index
   */
  has(index: number = 0): boolean {
    return has(this.entries, index)
  }

  /**
   * Checking empty list.
   */
  isEmpty(): boolean {
    return this.count() === 0
  }

  /**
   * Get the last element
   */
  last(): IBaseModel|undefined {
    return this.nth(this.count() - 1)
  }

  /**
   * Get any element by index
   */
  nth(index: number = 0): IBaseModel|undefined {
    if (has(this.entries, index)) {
      return this.entries[index]
    }
  }
}