import { uuid, isStr } from '../../utils'
import { ImmutableStore, getLanguage, inject, mainStore } from '../../plugin'
import type { II18nStore } from '../types'
import type { JSONObject } from '../../types'

/**
 * Store width language terms.
 */
class I18nStore extends ImmutableStore implements II18nStore {

  /**
   * Language of requested site for intern checks
   */
  #lang: string|null = null

  /**
   * Avoid race conditions
   */
  #requestid: string = ''

  constructor() {
    super({
      terms: {}
    })
  }

  /**
   * Request terms
   */
  async load(lang: string): Promise<void> {
    if (!isStr(lang, 1) || !mainStore.isValidLang(lang) || this.#lang === lang) {
      return
    }
    this.#requestid = uuid()
    const json: JSONObject = await getLanguage(lang, { raw: true, fields: true, id: this.#requestid })
    if (json.id !== this.#requestid) {
      return Promise.resolve()
    }
    this.#lang = lang
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