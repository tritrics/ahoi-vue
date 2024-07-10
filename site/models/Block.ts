import { toKey } from '../../fn'
import BaseFieldsModel from './BaseFields'
import type { IBlockModel } from '../types'
import type { JSONObject } from '../../types'

export default class BlockModel extends BaseFieldsModel implements IBlockModel {
  type: 'block' = 'block'

  block: string

  constructor(obj: JSONObject) {
    super(obj)
    this.block = toKey(obj.block)
  }

  is(block: string): boolean {
    return this.block === block
  }
}
