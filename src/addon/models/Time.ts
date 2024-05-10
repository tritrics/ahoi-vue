import { now } from '../../fn'
import DateBaseModel from './BaseDate'
import { componentOptions } from '../index'
import type { ITimeModel } from './types'
import type { IComponentOptions } from '../types'
import type { JSONObject } from '../../types'

export default class TimeModel extends DateBaseModel implements ITimeModel {
  type: 'time' = 'time'

  constructor(obj: JSONObject) {
    super(obj)
  }

  str(options: IComponentOptions = {}) {
    return this.value.toLocaleTimeString(
       componentOptions.get('locale', options?.locale),
       componentOptions.get('time', options?.time)
    )
  }

  isOver(): boolean {
    return now(this.value) > this.value
  }

  isComing(): boolean {
    return now(this.value) < this.value
  }
  
  isNow(): boolean {
    return now(this.value) === this.value
  }
}