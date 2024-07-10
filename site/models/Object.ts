import { parse } from '../index'
import type { JSONObject } from '../../types'

/**
 * Model representing an object field.
 */
export default class ObjectModel {
  
  /** */
  constructor(obj: JSONObject) {
    return parse(obj.fields)
  }
}
