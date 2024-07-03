import { toDate, dateToStr } from '../../fn'
import BaseDateModel from './BaseDate'
import type { ITimeModel } from './types'
import type { Object } from '../../types'

export default class TimeModel extends BaseDateModel implements ITimeModel {
  type: 'time' = 'time'

  constructor(def: Object) {
    def.format = 'h:ii'
    super(def)
  }
  
  data() {
    const date = toDate(this.value, this.format)
    return date ? dateToStr(date, 'hh:ii') : ''
  }
}