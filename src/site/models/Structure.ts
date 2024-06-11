import { parse } from '../index'
import type { JSONObject } from '../../types'

export default class StructureModel {
  constructor(obj: JSONObject) {
    return parse(obj.entries)
  }
}
