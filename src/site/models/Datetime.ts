import { now } from '../../fn'
import DateBaseModel from './BaseDate'
import { stores } from '../../stores'
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
      options?.locale ?? stores.options.get('locale'),
      { ...(options?.date ?? stores.options.get('date')), ...(options?.time ?? stores.options.get('time')) }
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