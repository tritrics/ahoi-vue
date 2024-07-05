import { uuid, isStr } from '../../fn'
import { AddonStore, getPage, globalStore } from '../../plugin'
import { convertResponse } from '../index'
import type { Object, ISiteStore } from '../../types'

/**
 * Store with plugin and addons options.
 */
class SiteStore extends AddonStore implements ISiteStore {

  /**
   * Flag if site was already requested.
   * Simple check for lang doesn't work in singelang enviroments.
   */
  #pristine: boolean = true

  /**
   * Avoid race conditions
   */
  #requestid: string = ''

  /** */
  constructor() {
    super({
      lang: null,
      meta: {},
      fields: {}
    })
  }

  /**
   * Request site.
   */
  async load(lang: string|null = null): Promise<void> {
    if (!globalStore.isValidLang(lang) || (!this.#pristine && this.is('lang', lang))) {
      return
    }
    this.#requestid = uuid()
    const json = await getPage(lang, { raw: true, id: this.#requestid })
    if (json.id !== this.#requestid) {
      return Promise.resolve()
    }
    const res: Object = convertResponse(json)
    this._set('lang', lang)
    this._set('meta', res.meta)
    this._set('fields', res.fields)
    this.#pristine = false
  }

  /**
   * Setter disabled
   */
  set(): void {}
}

export default SiteStore