import { toNum, isInt, isNum, extend } from '../../fn'
import { getOption } from '../index'
import { createBase } from './index'
import type { Object, JSONObject, ParserModel } from '../../types'

/**
 * Model for API field: number
 */
export default function createNumber(obj: JSONObject): ParserModel {
  const inject: Object = {
    $type: 'number',
    $value: toNum(obj.value),
    $isMin(min: number): boolean {
      return isNum(this.$value, min, null, true)
    },
    $isMax(max: number): boolean {
      return isNum(this.$value, null, max, true)
    },
    $isGreater(min: number): boolean {
      return isNum(this.$value, min, null, false)
    },
    $isSmaller(max: number): boolean {
      return isNum(this.$value, null, max, false)
    },
    $isBetween(min: number, max: number): boolean {
      return isNum(this.$value, min, max)
    },
    $str(options: Object = {}) {
      const fixed: number|null = getOption('number.fixed', options)
      const stringOptions: Object = {}
      if (isInt(fixed, 1)) {
        stringOptions.minimumFractionDigits = fixed
        stringOptions.maximumFractionDigits = fixed
      }
      return this.$value.toLocaleString(
        getOption('global.locale', options),
        stringOptions
      )
    },
  }
  return extend(createBase(), inject) as ParserModel
}
