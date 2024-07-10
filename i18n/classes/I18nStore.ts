import { uuid, isStr } from '../../fn'
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
      lang: null,
      terms: {}
    })
  }

  /**
   * Request terms
   */
  async load(lang: string): Promise<void> {
    if (!isStr(lang, 1) || !globalStore.isValidLang(lang) ||this.is('lang', lang)) {
      return
    }
    this.#requestid = uuid()
    const json: JSONObject = await getLanguage(lang, { raw: true, id: this.#requestid })
    if (json.id !== this.#requestid) {
      return Promise.resolve()
    }
    this._set('lang', lang)
    const convertResponse = inject('site', 'convertResponse') as Function
    const res = convertResponse(json)
    this._set('terms', res.fields)
  }

  /**
   * Setter disabled
   */
  set(): void {}
}

export default I18nStore