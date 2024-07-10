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
    if (isDate(obj.value, null, null, false, 'yyyy-mm-dd')) {
      value = toDate(obj.value, 'yyyy-mm-dd') as Date
    } else if (isDate(obj.value, null, null, false, 'hh:ii:ss')) {
      value = toDate(obj.value, 'hh:ii:ss') as Date
    }
    super(value)
    this.utc = toStr(obj.utc)
    this.iso = toStr(obj.iso)
    this.timezone = toStr(obj.timezone)
  }
}