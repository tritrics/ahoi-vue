import { extend, now, today } from '../../fn'
import { getOption } from '../index'
import { createBase } from './index'
import type { Object, JSONObject, ParserModel } from '../../types'

/**
 * Model for API field: datetime
 */
export default function createDateTime(obj: JSONObject): ParserModel {
  const inject: Object = {
    $type: 'datetime',
    $value: new Date(obj.meta.utc),
    $isPast(includeToday = false): boolean {
      return includeToday ? today() >= this.$value : today() > this.$value
    },
    $isFuture(includeToday = false): boolean {
      return includeToday ? today() <= this.$value : today() < this.$value
    }, 
    $isToday(): boolean {
      return +today() === +this.$value
    },
    $isOver(): boolean {
      return now() > this.$value
    },
    $isComing(): boolean {
      return now() <= this.$value
    },
    $str(options: Object = {}): string {
      return this.$value.toLocaleString(
        getOption('global', 'locale', options)
        , { ...getOption('date', 'format', options), ...getOption('time', 'format', options) }
      )
    }
  }
  return extend(createBase(), inject) as ParserModel
}
