import { now } from '../../fn'
import DateBaseModel from './BaseDate'
import { componentOptions } from '../index'
import type { IDatetimeModel } from './types'
import type { IComponentOptions } from '../types'
import type { JSONObject } from '../../types'

export default class DatetimeModel extends DateBaseModel implements IDatetimeModel {
  type: 'datetime' = 'datetime'

  constructor(obj: JSONObject) {
    super(obj)
  }

  str(options: IComponentOptions = {}): string {
    return this.value.toLocaleString(
      componentOptions.get('locale', options?.locale),
      { ...componentOptions.get('date', options?.time), ...componentOptions.get('time', options?.time) }
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