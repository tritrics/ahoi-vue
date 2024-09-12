import { toStr, isDate, toDate } from '../../fn'
import BaseModel from './Base'
import type { IBaseDateModel } from '../types'
import type { JSONObject } from '../../types'

/**
 * Base model for date models.
 */
export default class BaseDateModel extends BaseModel implements IBaseDateModel {

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
   * Get hours
   */
  hours(): number|null {
    if (this.value) {
      return this.value.getUTCHours()
    }
    return null
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
   * Get full year
   */
  year(): number|null {
    if (this.value) {
      return this.value.getUTCFullYear()
    }
    return null
  }
}