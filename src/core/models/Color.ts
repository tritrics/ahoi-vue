import { toStr, toBool } from '../../fn'
import BaseModel from './Base'
import type { ModelTypes, IColorModel } from '../types'
import type { JSONObject } from '../../types'

export default class ColorModel extends BaseModel implements IColorModel {
  _type: ModelTypes = 'color'

  _format: string

  _alpha: boolean
  
  constructor(obj: JSONObject) {
    super(toStr(obj.value))
    this._format = toStr(obj.format)
    this._alpha = toBool(obj.alpha)
  }

  get format(): string {
    return this._format
  }

  get alpha(): boolean {
    return this._alpha
  }
}
