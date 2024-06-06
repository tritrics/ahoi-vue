
import { ref } from 'vue'
import { each, toKey, isStr, isArr } from '../fn'
import Store from '../api/Store'
import GlobalStore from '../api/GlobalStore'
import type { IStore } from '../types'
import type { Object } from '../types'

/**
 * Store with plugin and addons options.
 */
class LangStore extends Store implements IStore {

  /**
   * Object with store values.
   */
  _data: Object = {

    /**
     * Reading direction of language
     * ltr = left to right
     * rtl = right to left
     */
    direction: ref<string>('ltr'),

    /**
     * @TODO
     */
    lang: ref<string>('en'),

    /**
     * @TODO
     */
    locale: ref<string>('en-EN'),

    /**
     * @TODO
     */
    multilang: ref<boolean>(false),

    /**
     * List with available/valid lang codes.
     * Can not be set, computed from languages.
     */
    langcodes: ref<Object>({}),

    /**
     * List with all available languages.
     */
    languages: ref<Object[]>([]),
  }

  /**
   * Setter
   */
  set(key: string|Object, val?: any): void {
    switch(key) {
      case 'direction': {
        const direction = toKey(val)
        if (direction === 'ltr' || direction === 'rtl') {
          this._data.direction.value = val
        }
        break
      }
      case 'lang':
        if (this._data.multilang.value && isStr(val)) {
          this._data.lang.value = val
        }
        break
      case 'languages':
        if (isArr(val)) {
          this._data.languages.value = val
          this._data.langcodes.value = []
          each(this._data.languages.value, (language: Object) => {
            this._data.langcodes.value[language.meta.code] = language.meta.slug
          })
        }
        break
    }
  }
}

export default LangStore