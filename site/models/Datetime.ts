import { now } from '../../fn'
import DateBaseModel from './BaseDate'
import { globalStore } from '../../plugin'
import type { ISiteOptions, IDatetimeModel } from '../types'
import type { JSONObject } from '../../types'

export default class DatetimeModel extends DateBaseModel implements IDatetimeModel {
  type: 'datetime' = 'datetime'

  constructor(obj: JSONObject) {
    super(obj)
  }

  str(options: ISiteOptions = {}): string {
    return this.value.toLocaleString(
      options?.locale ?? globalStore.get('locale'),
      { ...(options?.date ?? globalStore.get('date')), ...(options?.time ?? globalStore.get('time')) }
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