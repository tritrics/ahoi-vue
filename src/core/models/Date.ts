import { toStr, today } from '../../fn'
import BaseModel from './Base'
import { coreOptions } from '../index'
import type { ModelTypes, IDateModel, ICoreOptions } from '../types'
import type { JSONObject } from '../../types'

export default class DateModel extends BaseModel implements IDateModel {
  _type: ModelTypes = 'date'

  _utc: string

  _iso: string

  _timezone: string

  constructor(obj: JSONObject) {
    super(new Date(obj.value))
    this._utc = toStr(obj.utc)
    this._iso = toStr(obj.iso)
    this._timezone = toStr(obj.timezone)
  }

  get utc(): string {
    return this._utc
  }

  get iso(): string {
    return this._iso
  }

  get timezone(): string {
    return this._timezone
  }

  str(options: ICoreOptions = {}): string {
    return this.value.toLocaleDateString(
      coreOptions.get('locale', options?.locale),
      coreOptions.get('date', options?.time)
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