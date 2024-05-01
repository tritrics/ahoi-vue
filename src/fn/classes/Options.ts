import { isObj, isStr, isUndef, each, has } from '../'
import type { Object } from '../../types'

/**
 * Simple option object
 */
class Options {

  /**
   * The options like { key: value }
   */
  options: Object = {}

  /**
   * Init options.
   * Only given options can be set.
   */
  constructor(options: Object = {}) {
    this.set(options)
  }

  /**
   * Getter with optional given value to overwrite.
   */
  get(key: keyof Object, overwrite?: any): any {
    if (!isUndef(overwrite)) {
      return overwrite
    }
    if (has(this.options, key)) {
      return this.options[key]
    }
    return undefined
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
    } else if (isStr(mixed) && has(this.options, mixed)) {
      this.#setValue(mixed, val)
    }
  }

  #setValue(key: string, val: any) {
    if(has(this.options, key)) {
      this.options[key] = val
    }
  }
}

export default Options