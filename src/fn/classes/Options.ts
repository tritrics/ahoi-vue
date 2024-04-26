import { isObj, isStr, each } from '../'
import type { Object } from '../../types'

/**
 * Simple option object
 */
class Options {

  /**
   * The options like { key: value }
   * {object}
   */
  options: Object = {}

  /**
   */
  constructor(options: Object = {}) {
    this.set(options)
  }

  /**
   * Getter
   */
  get(key: keyof Object): any {
    return this.options[key]
  }

  /**
   * Setter
   * Either a key/value-pair or an object
   */
  set(mixed: Object|string, val?: any): void {
    if (isObj(mixed)) {
      each(mixed, (val: any, key: string) => {
        this.options[key] = val
      })
    } else if (isStr(mixed)) {
      this.options[mixed] = val
    }
  }
}

export default Options