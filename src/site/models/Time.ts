import { now } from '../../fn'
import DateBaseModel from './BaseDate'
import { store } from '../../store'
import type { ITimeModel } from './types'
import type { IsiteOptions } from '../types'
import type { JSONObject } from '../../types'

export default class TimeModel extends DateBaseModel implements ITimeModel {
  type: 'time' = 'time'

  constructor(obj: JSONObject) {
    super(obj)
  }

  str(options: IsiteOptions = {}) {
    return this.value.toLocaleTimeString(
      options?.locale ?? store.get('locale'),
      options?.time ?? store.get('time')
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