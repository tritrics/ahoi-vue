import BaseObjectModel from './BaseObject'
import type { ISiteModel } from '../types'
import type { JSONObject } from '../../types'

/**
 * Model representing the site request.
 */
export default class SiteModel extends BaseObjectModel implements ISiteModel {
  
  /**
   * Type
   */
  type: 'site' = 'site'
  
  /** */
  constructor(obj: JSONObject) {
    super(obj)
  }
}