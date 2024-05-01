import { has, toStr } from '../../fn'
import BaseModel from './Base'
import { parseModelsRec } from '../index'
import type { ModelTypes, IBlockModel } from '../types'
import type { Object, JSONObject } from '../../types'

export default class BlockModel extends BaseModel implements IBlockModel {
  _type: ModelTypes = 'block'

  _fields?: Object

  constructor(obj: JSONObject) {
    super(toStr(obj.block))
    if (has(obj, 'fields')) {
      this._fields = parseModelsRec(obj.fields)
    }
  }

  get fields(): Object | undefined {
    return this._fields
  }

  is(val: string): boolean {
    return this.value === val
  }
}
