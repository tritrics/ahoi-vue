import ObjectModel from '../data/ObjectModel'
import type { ISiteModel } from '../types'
import type { JSONObject } from '../../types'

/**
 * Model representing the site request.
 */
export default class SiteModel extends ObjectModel implements ISiteModel {
  
  /**
   * Type
   */
  type: 'site' = 'site'
  
  /** */
  constructor(obj: JSONObject) {
    super(obj)
  }
}