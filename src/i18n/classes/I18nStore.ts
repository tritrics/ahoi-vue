import { uuid, isObj } from '../../fn'
import { AddonStore, getLanguage, inject, globalStore } from '../../plugin'
import type { II18nStore } from '../types'
import type { JSONObject } from '../../types'

/**
 * Store width language terms.
 */
class I18nStore extends AddonStore implements II18nStore {

  /**
   * Avoid race conditions
   */
  #requestid: string = ''

  constructor() {
    super({
      lang: '',
      terms: {}
    })
  }

  /**
   * Request terms
   */
  async load(lang: string): Promise<void> {
    if (!globalStore.isValidLang(lang) || this.is('lang', lang)) {
      return
    }
    this.#requestid = uuid()
    const json: JSONObject = await getLanguage(lang, { raw: true, id: this.#requestid })
    if (json.id !== this.#requestid) {
      return
    }
    if (!isObj(json) || !json.ok) {
      super._set('terms', {})
      return
    }
    super._set('lang', lang)
    if (inject('site')) {
      const convertResponse = inject('site', 'convertResponse') as Function
      const res = convertResponse(json)
      super._set('terms', res.fields)
    } else {
      super._set('terms', json.body.fields)
    }
  }

  /**
   * Setter disabled
   */
  set(): void {}
}

export default I18nStore