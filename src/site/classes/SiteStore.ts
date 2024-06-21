import { isObj } from '../../fn'
import { AddonStore, getPage, globalStore } from '../../plugin'
import { convertResponse } from '../index'
import type { Object, ISiteStore } from '../../types'

/**
 * Store with plugin and addons options.
 */
class SiteStore extends AddonStore implements ISiteStore {

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
   * Initialization
   */
  init(): Promise<void> {
    globalStore.watch('lang', (newVal: string) => {
      this.load(newVal)
    })
    return this.load(globalStore.get('lang')) // don't use { immediate: true }, because we need the Promise here
  }

  /**
   * Request site.
   */
  async load(lang: string): Promise<void> {
    if (!globalStore.isValidLang(lang) || this.is('lang', lang)) {
      return
    }
    super._set('lang', lang)
    const json = await getPage(lang, { raw: true })
    if (!isObj(json) || !json.ok) {
      super._set('meta', {})
      super._set('link', {})
      super._set('home', {})
      super._set('fields', {})
      return
    }
    const res: Object = convertResponse(json)
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