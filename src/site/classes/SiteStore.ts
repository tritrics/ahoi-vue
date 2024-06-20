import { isObj, isStr } from '../../fn'
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

    globalStore.watch('lang', async (newVal) => {
      this.set('lang', newVal)
    })
  }

  /**
   * Setter
   */
  async set(key: string, val?: any): Promise<void> {
    switch(key) {
      case 'lang':
        if (isStr(val) && this.isNot('lang', val)) {
          super.set('lang', val)
          await this.#setSite(val)
        }
        break
    }
  }

  /**
   * Request site, implicit done on init().
   */
  async #setSite(lang: string): Promise<void> {
    const json = await getPage(lang, { raw: true })
    if (!isObj(json) || !json.ok) {
      super.set('meta', {})
      super.set('link', {})
      super.set('home', {})
      super.set('fields', {})
      return
    }
    const res: Object = convertResponse(json)
    super.set('meta', res.meta)
    super.set('link', res.link)
    super.set('home', res.home)
    super.set('fields', res.fields)
  }
}

export default SiteStore