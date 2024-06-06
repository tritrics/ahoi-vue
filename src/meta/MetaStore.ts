import { ref } from 'vue'
import { isStr } from '../fn'
import Store from '../api/Store'
import type { IStore } from '../types'
import type { Object } from '../types'

/**
 * Store with plugin and addons options.
 */
class MetaStore extends Store implements IStore {

  /**
   * Object with store values.
   */
  _data: Object = {

    /**
     * Brand of the page (= site title)
     */
    brand: ref<string>(''),

    /**
     * Separator to combine brand and title in <title>.
     */
    separator: ref<string>(' - '),

    /**
     * Title of the page (= page title)
     */
    title: ref<string>(''),
  }

  /**
   * Setter
   */
  set(key: string|Object, val?: any): void {
    switch(key) {
      case 'brand':
        if (isStr(val)) {
          this._data.brand.value = val
        }
        break
      case 'separator':
        if (isStr(val)) {
          this._data.separator.value = val
        }
        break
      case 'title':
        if (isStr(val)) {
          this._data.title.value = val
        }
        break
    }
  }
}

export default MetaStore