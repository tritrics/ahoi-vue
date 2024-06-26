import { uuid, isObj } from '../../fn'
import { AddonStore, getPage, globalStore } from '../../plugin'
import { convertResponse } from '../index'
import type { Object, ISiteStore } from '../../types'

/**
 * Store with plugin and addons options.
 */
class SiteStore extends AddonStore implements ISiteStore {

  /**
   * Avoid race conditions
   */
  #requestid: string = ''

  /** */
  constructor() {
    super({
      lang: '',
      meta: {},
      link: {},
      home: {},
      fields: {}
    })
  }

  /**
   * Request site.
   */
  async load(lang: string): Promise<void> {
    if (!globalStore.isValidLang(lang) || this.is('lang', lang)) {
      return
    }
    this.#requestid = uuid()
    const json = await getPage(lang, { raw: true, id: this.#requestid })
    if (json.id !== this.#requestid) {
      return
    }
    if (!isObj(json) || !json.ok) {
      super._set('lang', '')
      super._set('meta', {})
      super._set('link', {})
      super._set('home', {})
      super._set('fields', {})
      return
    }
    const res: Object = convertResponse(json)
    super._set('lang', lang)
    super._set('meta', res.meta)
    super._set('link', res.link)
    super._set('home', res.home)
    super._set('fields', res.fields)
  }

  /**
   * Setter disabled
   */
  set(): void {}
}

export default SiteStore