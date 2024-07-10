import { toStr, each, ltrim } from '../../fn'
import type { JSONObject } from '../../types'
import type { ModelTypes, IBaseModel } from '../types'
import type { Object } from '../../types'

export default class BaseModel implements IBaseModel {
  type: ModelTypes = 'base'

  value: any = null

  constructor(value: any) {
    this.value = value
  }

  get(): any {
    return this.value
  }

  str(): string {
    return toStr(this.value)
  }
  
  toString(): string {
    return this.str()
  }

  toJSON(): JSONObject {
    const json: Object = {}
    const props = Object.keys(this)
    each(props, (prop: keyof this) => {
      const publicName: string = ltrim(prop as string, '_')
      json[publicName] = this[prop]
    })
    return json
  }
}
