import { toDate, dateToStr } from '../../fn'
import BaseDateModel from './BaseDate'
import type { IFormTimeModel } from '../types'
import type { Object } from '../../types'

 /**
  * Model to represent a time input
  */
export default class TimeModel extends BaseDateModel implements IFormTimeModel {

  /**
   * Type
   */
  type: 'time' = 'time'

  /** */
  constructor(def: Object) {
    def.format = 'h:ii'
    super(def)
  }
  
  /**
   * Getter for value for use in post data
   */
  get() {
    const date = toDate(this.value, this.format)
    return date ? dateToStr(date, 'hh:ii') : ''
  }
}