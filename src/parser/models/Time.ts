import { extend, now } from '../../fn'
import { getOption } from '../index'
import { createBase } from './index'
import type { Object, JSONObject, ParserModel } from '../../types'

/**
 * Model for API field: time
 */
export default function createTime(obj: JSONObject): ParserModel {
  const inject: Object = {
    type: 'time',
    value: new Date(obj.iso),
    utc: obj.utc,
    iso: obj.iso,
    timezone: obj.timezone,
    str(options: Object = {}) {
      return this.value.toLocaleTimeString(
        getOption('global', 'locale', options),
        getOption('time', 'format', options)
      )
    },
    isOver(): boolean {
      return now(this.value) > this.value
    },
    isComing(): boolean {
      return now(this.value) < this.value
    },
    isNow(): boolean {
      return now(this.value) === this.value
    }
  }
  return extend(createBase(), inject) as ParserModel
}