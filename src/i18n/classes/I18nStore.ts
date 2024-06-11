import { ref } from 'vue'
import { isObj, toKey } from '../../fn'
import { BaseStore, getLanguage, inject, globalStore } from '../../plugin'
import type { II18nStore } from '../types'
import type { Object, JSONObject } from '../../types'

/**
 * Store width language terms.
 */
class I18nStore extends BaseStore implements II18nStore {

  /**
   * Object with terms.
   */
  _data: Object = {

    terms: ref<Object>({})

  }

  /**
   * Init store.
   * Is called, after all store instances have been created.
   */
  async init(): Promise<void> {
    globalStore.watch('lang', async (newVal: string) => {
      await this._requestLanguage(newVal)
    }, { immediate: true })
  }

  /**
   * Setter disabled.
   */
  async set(): Promise<void> {}

  /**
   * Selecting terms of a language.
   */
  async _requestLanguage(code: string|null): Promise<undefined> {
    const normCode = toKey(code)
    if (globalStore.isValidLang(normCode) && (normCode !== globalStore.get('lang'))) {
      const json: JSONObject = await getLanguage(normCode, { raw: true })
      if (isObj(json) && json.ok) {
        const fn = inject('site', 'convertResponse', (json: JSONObject): JSONObject => json) as Function
        this._data.terms.value = fn(json)
      }
    }
  }
}

export default I18nStore