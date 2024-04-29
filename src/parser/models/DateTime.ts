import { extend, now } from '../../fn'
import { getOption } from '../index'
import { createBase } from './index'
import type { Object, JSONObject, ParserModel } from '../../types'

/**
 * Model for API field: datetime
 */
export default function createDatetime(obj: JSONObject): ParserModel {
  const inject: Object = {
    type: 'datetime',
    value: new Date(obj.utc),
    utc: obj.utc,
    iso: obj.iso,
    timezone: obj.timezone,
    str(options: Object = {}): string {
      return this.value.toLocaleString(
        getOption('global', 'locale', options)
        , { ...getOption('date', 'format', options), ...getOption('time', 'format', options) }
      )
    },
    isOver(): boolean {
      return now() > this.value
    },
    isComing(): boolean {
      return now() < this.value
    },
    isNow(): boolean {
      return now() === this.value
    },
  }
  return extend(createBase(), inject) as ParserModel
}
