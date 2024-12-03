import { toStr, isDate, toDate, dateToStr, now } from '../../utils'
import BaseModel from './BaseModel'
import { apiStore } from '../../plugin'
import type { ISiteOptions, IDatetimeModel, DateTypes } from '../types'
import type { JSONObject } from '../../types'

/**
 * Base model for date models.
 */
export default class DatetimeModel extends BaseModel implements IDatetimeModel {

  type: DateTypes = 'datetime'

  /**
   * Value as utc string
   */
  utc: string

  /**
   * Value as iso string
   */
  iso: string

  /**
   * Timezone as string
   */
  timezone: string

  /**
   * Default dateformat for getter format()
   */
  defaultFormat: string = 'yyyy-mm-dd hh:ii:ss'

  /** */
  constructor(obj: JSONObject) {
    let value: Date|null = null
    if (isDate(obj.value, null, null, false, 'yyyy-mm-dd hh:ii:ss')) {
      value = toDate(obj.value, 'yyyy-mm-dd hh:ii:ss') as Date
    } else if (isDate(obj.value, null, null, false, 'yyyy-mm-dd')) {
      value = toDate(obj.value, 'yyyy-mm-dd') as Date
    } else if (isDate(obj.value, null, null, false, 'hh:ii:ss')) {
      value = toDate(obj.value, 'hh:ii:ss') as Date
    }
    super(value)
    this.utc = toStr(obj.utc)
    this.iso = toStr(obj.iso)
    this.timezone = toStr(obj.timezone)
  }

  /**
   * Get the day in the month
   */
  day(): number|null {
    if (this.value) {
      return this.value.getUTCDate()
    }
    return null
  }

  /**
   * Get Date as string in a given format
   */
  format(format: string = this.defaultFormat): string {
    return dateToStr(this.value, format)
  }
  
  /**
   * Get hours
   */
  hours(): number|null {
    if (this.value) {
      return this.value.getUTCHours()
    }
    return null
  }

  /**
   * Flag to check, if datetime is in the future
   */
  isComing(): boolean {
    return now() < this.value
  }

  /**
   * Checking empty value.
   */
  isEmpty(): boolean {
    return !(this.value instanceof Date)
  }
  
  /**
   * Flag to check, if datetime is now
   */
  isNow(): boolean {
    return now() === this.value
  }

  /**
   * Flag to check, if datetime is over
   */
  isOver(): boolean {
    return now() > this.value
  }
  
  /**
   * Get minutes
   */
  minutes(): number|null {
    if (this.value) {
      return this.value.getUTCMinutes()
    }
    return null
  }

  /**
   * Get (the real) number of the month
   */
  month(): number|null {
    if (this.value) {
      return this.value.getUTCMonth() + 1
    }
    return null
  }

  /**
   * Getter for value as string
   */
  str(options: ISiteOptions = {}): string {
    return this.value.toLocaleString(
      options?.locale ?? apiStore.get('locale'),
      {
        ...(options?.date ?? apiStore.get('date')),
        ...(options?.time ?? apiStore.get('time')),
        timeZone: 'UTC'
      }
    )
  }

  /**
   * Get full year
   */
  year(): number|null {
    if (this.value) {
      return this.value.getUTCFullYear()
    }
    return null
  }
}