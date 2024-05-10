import { today } from '../../fn'
import DateBaseModel from './BaseDate'
import { componentOptions } from '../index'
import type { IDateModel } from './types'
import type { IComponentOptions } from '../types'
import type { JSONObject } from '../../types'

export default class DateModel extends DateBaseModel implements IDateModel {
  type: 'date' = 'date'

  constructor(obj: JSONObject) {
    super(obj)
  }

  str(options: IComponentOptions = {}): string {
    return this.value.toLocaleDateString(
      componentOptions.get('locale', options?.locale),
      componentOptions.get('date', options?.time)
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