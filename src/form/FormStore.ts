
import { ref } from 'vue'
import { isStr } from '../fn'
import Store from '../api/Store'
import type { IStore } from '../types'
import type { Object } from '../types'

/**
 * Store with plugin and addons options.
 */
class FormStore extends Store implements IStore {

  /**
   * Object with store values.
   */
  _data: Object = {

  }

  /**
   * Setter
   */
  set(key: string|Object, val?: any): void {
    switch(key) {
      case 'xy':
        break
    }
  }
}

export default FormStore