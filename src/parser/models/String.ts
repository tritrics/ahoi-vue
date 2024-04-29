import { isObj, has, isStr, isNum, isBool, toBool, toStr, extend } from '../../fn'
import { createBase } from './index'
import type { Object, JSONObject, ParserModel } from '../../types'

/**
 * Model for all remaining API fields without own model
 * Object can handle all different data types
 */
export default function createString(mixed: JSONObject): ParserModel {
  let value = (isObj(mixed) && has(mixed, 'value')) ? mixed.value : mixed
  if (!isStr(value)) {
    if (isNum(mixed)) {
      value = toStr(mixed)
    } else if (isBool(mixed)) {
      value = toBool(mixed) ? 'true' : 'false'
    } else {
      value = null
    }
  }
  const inject: Object = {
    type: 'string',
    value: value,
  }
  return extend(createBase(), inject) as ParserModel
}
