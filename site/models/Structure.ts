import { parse } from '../index'
import type { JSONObject } from '../../types'

/**
 * Model representing a structure field.
 */
export default class StructureModel {
  
  /** */
  constructor(obj: JSONObject) {
    return parse(obj.entries)
  }
}
