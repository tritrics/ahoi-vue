import { now } from '../../fn'
import DateBaseModel from './BaseDate'
import { globalStore } from '../../plugin'
import type { ITimeModel, ISiteOptions } from '../types'
import type { JSONObject } from '../../types'

export default class TimeModel extends DateBaseModel implements ITimeModel {
  type: 'time' = 'time'

  constructor(obj: JSONObject) {
    super(obj)
  }

  str(options: ISiteOptions = {}) {
    return this.value.toLocaleTimeString(
      options?.locale ?? globalStore.get('locale'),
      options?.time ?? globalStore.get('time')
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