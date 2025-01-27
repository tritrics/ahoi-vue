import { now } from '../../utils'
import DatetimeModel from '../data/DatetimeModel'
import { mainStore } from '../../plugin'
import type { ITimeModel, ISiteOptions } from '../types'
import type { JSONObject } from '../../types'

/**
 * Model representing a time field.
 */
export default class TimeModel extends DatetimeModel implements ITimeModel {
  
  /**
   * Type
   */
  type: 'time' = 'time'

  /**
   * Default dateformat for getter format()
   */
  defaultFormat: string = 'hh:ii:ss'

  /** */
  constructor(obj: JSONObject) {
    super(obj)
  }

  /**
   * Getter for value as string
   */
  str(options: ISiteOptions = {}) {
    return this.value.toLocaleTimeString(
      options?.locale ?? mainStore.get('locale'),
      {
        ...(options?.time ?? mainStore.get('time')),
        timeZone: 'UTC'
      }
    )
  }

  /**
   * Flag to check, if time is in the future
   */
  isComing(): boolean {
    return now(this.value) < this.value
  }
  
  /**
   * Flag to check, if time is now
   */
  isNow(): boolean {
    return now(this.value) === this.value
  }

  /**
   * Flag to determine, if time is over
   */
  isOver(): boolean {
    return now(this.value) > this.value
  }
}