import { today } from '../../fn'
import DateBaseModel from './BaseDate'
import { stores } from '../../stores'
import type { IDateModel } from './types'
import type { IsiteOptions } from '../types'
import type { JSONObject } from '../../types'

export default class DateModel extends DateBaseModel implements IDateModel {
  type: 'date' = 'date'

  constructor(obj: JSONObject) {
    super(obj)
  }

  str(options: IsiteOptions = {}): string {
    return this.value.toLocaleDateString(
      options?.locale ?? stores.options.get('locale'),
      options?.time ?? stores.options.get('time')
    )
  }

  isOver(includeToday = false): boolean {
    return includeToday ? today() >= this.value : today() > this.value
  }

  isComing(includeToday = false): boolean {
    return includeToday ? today() <= this.value : today() < this.value
  }
  
  isNow(): boolean {
    return +today() === +this.value
  }
}