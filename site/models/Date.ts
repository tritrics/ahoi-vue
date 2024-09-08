import { today } from '../../fn'
import DateBaseModel from './BaseDate'
import { globalStore } from '../../plugin'
import type { ISiteOptions, IDateModel } from '../types'
import type { JSONObject } from '../../types'

/**
 * Model representing a date field.
 */
export default class DateModel extends DateBaseModel implements IDateModel {
  
  /**
   * Type
   */
  type: 'date' = 'date'

  /** */
  constructor(obj: JSONObject) {
    super(obj)
  }

  /**
   * Getter for value as string
   */
  str(options: ISiteOptions = {}): string {
    return this.value.toLocaleDateString(
      options?.locale ?? globalStore.get('locale'),
      {
        ...(options?.date ?? globalStore.get('date')),
        timeZone: 'UTC'
      }
    )
  }

  /**
   * Flag to check, if date is over
   */
  isOver(includeToday = false): boolean {
    return includeToday ? today() >= this.value : today() > this.value
  }

  /**
   * Flag to check, if date is in the future
   */
  isComing(includeToday = false): boolean {
    return includeToday ? today() <= this.value : today() < this.value
  }
  
  /**
   * Flag to check, if date is today
   */
  isNow(): boolean {
    return +today() === +this.value
  }
}