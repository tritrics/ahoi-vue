import { parse } from '../index'
import BaseModel from './Base'
import type { IBaseModel, IBaseEntriesModel } from './types'
import type { JSONObject } from '../../types'

export default class BaseEntriesModel extends BaseModel implements IBaseEntriesModel {
  entries: IBaseModel[]

  constructor(obj: JSONObject) {
    super(undefined)
    this.entries = parse(obj.entries) as BaseModel[]
  }
}