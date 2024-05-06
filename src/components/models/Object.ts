import { parseModelsRec } from '../index'
import type { JSONObject } from '../../types'

export default class ObjectModel {
  constructor(obj: JSONObject) {
    return parseModelsRec(obj.fields)
  }
}
