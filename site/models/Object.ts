import { parse } from '../index'
import type { JSONObject } from '../../types'

export default class ObjectModel {
  constructor(obj: JSONObject) {
    return parse(obj.fields)
  }
}
