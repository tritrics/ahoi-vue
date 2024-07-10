import { toStr, toBool } from '../../fn'
import BaseModel from './Base'
import type { IColorModel } from '../types'
import type { JSONObject } from '../../types'

/**
 * Model representing a color field.
 */
export default class ColorModel extends BaseModel implements IColorModel {
  
  /**
   * Type
   */
  type: 'color' = 'color'

  /**
   * Notation format of the value/color
   */
  format: string

  /**
   * Color in alpha notation
   */
  alpha: boolean
  
  /** */
  constructor(obj: JSONObject) {
    super(toStr(obj.value))
    this.format = toStr(obj.format)
    this.alpha = toBool(obj.alpha)
  }
}
