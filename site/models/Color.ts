import { toStr, toBool } from '../../fn'
import BaseModel from './Base'
import type { IColorModel } from '../types'
import type { JSONObject } from '../../types'

export default class ColorModel extends BaseModel implements IColorModel {
  type: 'color' = 'color'

  format: string

  alpha: boolean
  
  constructor(obj: JSONObject) {
    super(toStr(obj.value))
    this.format = toStr(obj.format)
    this.alpha = toBool(obj.alpha)
  }
}
