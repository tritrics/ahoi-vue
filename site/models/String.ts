import { toStr } from '../../fn'
import BaseModel from './Base'
import type { IStringModel } from '../types'

export default class StringModel extends BaseModel implements IStringModel {
  type: 'string' = 'string'
  
  constructor(mixed: any) {
    super(toStr(mixed.value ?? mixed))
  }
}