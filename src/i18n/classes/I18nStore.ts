import { isObj, isStr } from '../../fn'
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

    // watch lang
  }

  /**
   * Setter
   */
  async set(key: string, val?: any): Promise<void> {
    switch(key) {
      case 'lang':
        if (isStr(val) && this.isNot('lang', val)) {
          super.set('lang', val)
          await this.#setTerms(val)
        }
        break
    }
  }

  /**
   * Selecting terms of a language.
   */
  async #setTerms(code: string): Promise<undefined> {
    const json: JSONObject = await getLanguage(code, { raw: true })
    if (!isObj(json) || !json.ok) {
      super.set('terms', {})
      return
    }
    if (inject('site')) {
      const convertResponse = inject('site', 'convertResponse') as Function
      const res = convertResponse(json)
      super.set('terms', res.terms)
    } else {
      super.set('terms', json.body.terms)
    }
  }
}

export default I18nStore