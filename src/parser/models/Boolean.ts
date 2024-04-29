import { toBool, extend } from '../../fn'
import { createBase } from './index'
import type { Object, JSONObject, ParserModel } from '../../types'

/**
 * Model for API field: boolean
 */
export default function createBoolean(obj: JSONObject): ParserModel {
  const inject: Object = {
    type: 'boolean',
    value: toBool(obj.value),
    str(): string {
      return this.value ? 'true' : 'false'
    },
    is(val: any): boolean {
      return toBool(val) === this.value
    },
    isTrue(): boolean {
      return this.value === true
    },
    isFalse(): boolean {
      return this.value === false
    }
  }
  return extend(createBase(), inject) as ParserModel
}
