import { isObj } from '../../fn'
import { AddonStore, getLanguage, inject, globalStore } from '../../plugin'
import type { II18nStore } from '../types'
import type { JSONObject } from '../../types'

/**
 * Store width language terms.
 */
class I18nStore extends AddonStore implements II18nStore {

  constructor() {
    super({
      lang: '',
      terms: {}
    })
  }
  
  /**
   * Initialization
   */
  init(): Promise<void> {
    globalStore.watch('lang', (newVal: string) => {
      this.load(newVal)
    })
    return this.load(globalStore.get('lang')) // don't use { immediate: true }, because we need the Promise here
  }

  /**
   * Request terms
   */
  async load(lang: string): Promise<void> {
    if (!globalStore.isValidLang(lang) || this.is('lang', lang)) {
      return
    }
    super._set('lang', lang)
    const json: JSONObject = await getLanguage(lang, { raw: true })
    if (!isObj(json) || !json.ok) {
      super._set('terms', {})
      return
    }
    if (inject('site')) {
      const convertResponse = inject('site', 'convertResponse') as Function
      const res = convertResponse(json)
      super._set('terms', res.terms)
    } else {
      super._set('terms', json.body.terms)
    }
  }

  /**
   * Setter disabled
   */
  set(): void {}
}

export default I18nStore