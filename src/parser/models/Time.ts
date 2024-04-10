import { extend, now } from '../../fn'
import { getOption } from '../index'
import { createBase } from './index'
import type { Object, JSONObject, ParserModel } from '../../types'

/**
 * Model for API field: time
 */
export default function createTime(obj: JSONObject): ParserModel {
  const inject: Object = {
    $type: 'time',
    $value: new Date(obj.meta.iso),
    $timezone: obj.meta.timezone,
    $isOver(): boolean {
      return now(this.$value) > this.$value
    },
    $isComing(): boolean {
      return now(this.$value) <= this.$value
    },
    $str(options: Object = {}) {
      return this.$value.toLocaleTimeString(
        getOption('global.locale', options),
        getOption('time.format', options)
      )
    }
  }
  return extend(createBase(), inject) as ParserModel
}
