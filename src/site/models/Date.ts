import { today } from '../../fn'
import DateBaseModel from './BaseDate'
import { globalStore } from '../../plugin'
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
      options?.locale ?? globalStore.get('locale'),
      options?.time ?? globalStore.get('time')
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