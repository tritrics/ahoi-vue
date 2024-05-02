import { toBool } from '../../fn'
import BaseModel from './Base'
import type { IBooleanModel } from './types'

export default class BooleanModel extends BaseModel implements IBooleanModel {
  type: 'boolean' = 'boolean'

  constructor(mixed: any) {
    super(toBool(mixed.value ?? mixed))
  }

  str(): string {
    return this.value ? 'true' : 'false'
  }

  is(val: any): boolean {
    return toBool(val) === this.value
  }

  isTrue(): boolean {
    return this.value === true
  }
  
  isFalse(): boolean {
    return this.value === false
  }
}