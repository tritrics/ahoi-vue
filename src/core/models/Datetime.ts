import { now } from '../../fn'
import DateModel from './Date'
import { coreOptions } from '../index'
import type { ModelTypes, IDateModel, ICoreOptions } from '../types'

export default class DatetimeModel extends DateModel implements IDateModel {
  _type: ModelTypes = 'datetime'

  str(options: ICoreOptions = {}): string {
    return this.value.toLocaleString(
      coreOptions.get('locale', options?.locale)
      , { ...coreOptions.get('date', options?.time), ...coreOptions.get('time', options?.time) }
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