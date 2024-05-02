import { isObj, isStr, isUndef, each, has } from '../'
import type { Object } from '../../types'

/**
 * Simple option object
 * @TODO: add allowed value types to def
 */
class Options {

  /**
   * The options like { key: value }
   */
  #options: Object = {}

  /**
   * Init options.
   * Only given options can be set.
   */
  constructor(def: Object = {}) {
    this.#options = isObj(def) ? def : {}
  }

  /**
   * Getter with optional given value to overwrite.
   */
  get(key: keyof Object, overwrite?: any): any {
    if (!isUndef(overwrite)) {
      return overwrite
    }
    if (has(this.#options, key)) {
      return this.#options[key]
    }
    return undefined
  }

  /**
   * Get all options as object
   */
  obj(): Object {
    return this.#options
  }

  /**
   * Setter, either a key/value-pair or an object.
   * Sets only existing keys.
   */
  set(mixed: Object|string, val?: any): void {
    if (isObj(mixed)) {
      each(mixed, (val: any, key: string) => {
        this.#setValue(key, val)
      })
    } else if (isStr(mixed) && has(this.#options, mixed)) {
      this.#setValue(mixed, val)
    }
  }

  #setValue(key: string, val: any) {
    if(has(this.#options, key)) {
      this.#options[key] = val
    }
  }
}

export default Options