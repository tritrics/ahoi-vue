import { now } from '../../fn'
import DateBaseModel from './BaseDate'
import { siteOptions } from '../index'
import type { IDatetimeModel } from './types'
import type { IsiteOptions } from '../types'
import type { JSONObject } from '../../types'

export default class DatetimeModel extends DateBaseModel implements IDatetimeModel {
  type: 'datetime' = 'datetime'

  constructor(obj: JSONObject) {
    super(obj)
  }

  str(options: IsiteOptions = {}): string {
    return this.value.toLocaleString(
      siteOptions.get('locale', options?.locale),
      { ...siteOptions.get('date', options?.time), ...siteOptions.get('time', options?.time) }
    )
  }

  isOver(): boolean {
    return now() > this.value
  }

  isComing(): boolean {
    return now() < this.value
  }
  
  isNow(): boolean {
    return now() === this.value
  }
}