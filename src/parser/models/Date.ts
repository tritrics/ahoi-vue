import { extend, today } from '../../fn'
import { getOption } from '../index'
import { createBase } from './index'
import type { Object, JSONObject, ParserModel } from '../../types'

/**
 * Model for API field: date
 */
export default function createDate(obj: JSONObject): ParserModel {
  const inject: Object = {
    type: 'date',
    value: new Date(obj.utc),
    utc: obj.utc,
    iso: obj.iso,
    timezone: obj.timezone,
    str(options: Object = {}): string {
      return this.value.toLocaleDateString(
        getOption('global', 'locale', options),
        getOption('date', 'format', options)
      )
    },
    isOver(includeToday = false): boolean {
      return includeToday ? today() >= this.value : today() > this.value
    },
    isComing(includeToday = false): boolean {
      return includeToday ? today() <= this.value : today() < this.value
    }, 
    isNow(): boolean {
      return +today() === +this.value
    },
  }
  return extend(createBase(), inject) as ParserModel
}