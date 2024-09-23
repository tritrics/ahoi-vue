import DateBaseModel from './BaseDate'
import type { IDatetimeModel } from '../types'

/**
 * Model representing a datetime field.
 */
export default class DatetimeModel extends DateBaseModel implements IDatetimeModel {
  
  /**
   * Type
   */
  type: 'datetime' = 'datetime'
}