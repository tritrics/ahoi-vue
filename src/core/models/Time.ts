import { now } from '../../fn'
import DateModel from './Date'
import { coreOptions } from '../index'
import type { ModelTypes, IDateModel, ICoreOptions } from '../types'

export default class TimeModel extends DateModel implements IDateModel {
  _type: ModelTypes = 'time'

  str(options: ICoreOptions = {}) {
    return this.value.toLocaleTimeString(
       coreOptions.get('locale', options?.locale),
       coreOptions.get('time', options?.time)
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