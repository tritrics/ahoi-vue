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
  params: Object = {}

  /**
   * @param {object} params 
   */
  constructor(params: Object = {}) {
    this.set(params)
  }

  /**
   * Getter
   */
  get(key: keyof Object): any {
    return this.params[key]
  }

  /**
   * Setter
   * Either a key/value-pair or an object
   */
  set(mixed: Object|string, val?: any): void {
    if (isObj(mixed)) {
      each(mixed, (val: any, key: string) => {
        this.params[key] = val
      })
    } else if (isStr(mixed)) {
      this.params[mixed] = val
    }
  }
}

export default Options