import { toStr } from '../../fn'
import BaseModel from './Base'
import type { IBaseDateModel } from './types'
import type { JSONObject } from '../../types'

export default class BaseDateModel extends BaseModel implements IBaseDateModel {
  utc: string

  iso: string

  timezone: string

  constructor(obj: JSONObject) {
    super(new Date(obj.value))
    this.utc = toStr(obj.utc)
    this.iso = toStr(obj.iso)
    this.timezone = toStr(obj.timezone)
  }
}