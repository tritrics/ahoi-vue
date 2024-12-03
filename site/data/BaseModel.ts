import { toStr, each, has, isEmpty } from '../../utils'
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
  value: any = undefined

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
   * Checking equality.
   */
  is(val: any): boolean {
    return this.value === val
  }

  /**
   * Checking empty value.
   */
  isEmpty(): boolean {
    return isEmpty(this.value)
  }

  /**
   * Checking non-equality.
   */
  isNot(val: any): boolean {
    return this.value !== val
  }

  /**
   * Checking non-empty value.
   */
  isNotEmpty(): boolean {
    return !this.isEmpty()
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
  toJSONold(): JSONObject {
    const ordered = ['type', 'value', 'meta', 'link', 'languages', 'fields', 'collection', 'entries']
    const json: Object = {}
    each(ordered, (prop: keyof this) => {
      if (has(this, prop as string)) {
        const publicName: string = prop as string
        json[publicName] = this[prop]
      }
    })
    const props = Object.keys(this)
    each(props, (prop: keyof this) => {
      if (!has(json, prop as string)) {
        const publicName: string = prop as string
        json[publicName] = this[prop]
      }
    })
    return json
  }

  /** */
  toJSON(): JSONObject {
    const json: Object = {
      type: undefined,
      value: undefined,
      meta: undefined,
      link: undefined,
      languages: undefined,
      fields: undefined,
      collection: undefined,
      entries: undefined,
    }
    const props = Object.keys(this)
    each(props, (prop: keyof this) => {
      const publicName: string = prop as string
      json[publicName] = this[prop]
    })
    return json
  }
}
