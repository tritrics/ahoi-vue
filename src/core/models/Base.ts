import { toStr, each, trim } from '../../fn'
import type { JSONObject } from '../../types'
import type { ModelTypes, IBaseModel } from '../types'
import type { Object } from '../../types'

export default class BaseModel implements IBaseModel {
  _type: ModelTypes = 'base'

  _value: any = null

  constructor(value: any) {
    this._value = value
  }

  get type(): ModelTypes {
    return this._type
  }

  get value(): any {
    return this._value
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
      const publicName: string = trim(prop as string, true, false, '_')
      json[publicName] = this[prop]
    })
    return json
  }
}
