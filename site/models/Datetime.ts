import { now } from '../../fn'
import DateBaseModel from './BaseDate'
import { globalStore } from '../../plugin'
import type { ISiteOptions, IDatetimeModel } from '../types'
import type { JSONObject } from '../../types'

/**
 * Model representing a datetime field.
 */
export default class DatetimeModel extends DateBaseModel implements IDatetimeModel {
  
  /**
   * Type
   */
  type: 'datetime' = 'datetime'

  /** */
  constructor(obj: JSONObject) {
    super(obj)
  }

  /**
   * Getter for value as string
   */
  str(options: ISiteOptions = {}): string {
    return this.value.toLocaleString(
      options?.locale ?? globalStore.get('locale'),
      {
        ...(options?.date ?? globalStore.get('date')),
        ...(options?.time ?? globalStore.get('time')),
        timeZone: 'UTC'
      }
    )
  }

  /**
   * Flag to check, if datetime is over
   */
  isOver(): boolean {
    return now() > this.value
  }

  /**
   * Flag to check, if datetime is in the future
   */
  isComing(): boolean {
    return now() < this.value
  }
  
  /**
   * Flag to check, if datetime is now
   */
  isNow(): boolean {
    return now() === this.value
  }
}