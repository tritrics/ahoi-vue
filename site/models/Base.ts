import { toStr, each, ltrim } from '../../fn'
import type { JSONObject } from '../../types'
import type { ModelTypes, IBaseModel } from '../types'
import type { Object } from '../../types'

/**
 * Base model.
 */
export default class BaseModel implements IBaseModel {
  
  /**
   * Type
   */
  type: ModelTypes = 'base'

  /**
   * Value
   */
  value: any = null

  /** */
  constructor(value: any) {
    this.value = value
  }

  /**
   * Getter for (raw) value
   */
  get(): any {
    return this.value
  }

  /**
   * Compare value
   */
  is(compare: any): boolean {
    return this.value === compare
  }
  
  /**
   * Getter for value as string
   */
  str(): string {
    return toStr(this.value)
  }
  
  /** */
  toString(): string {
    return this.str()
  }

  /** */
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
