
import { ref } from 'vue'
import { has, isStr, isObj } from '../fn'
import { convertResponse } from './index'
import { stores } from '../api'
import { getSite } from '../api/api'
import Store from '../api/Store'
import type { IStore } from '../types'
import type { Object } from '../types'

/**
 * Store with plugin and addons options.
 */
class SiteStore extends Store implements IStore {

  /**
   * Object with store values.
   */
  _data: Object = {
    node: ref(''),
    meta: ref({}),
    link: ref({}),
    fields: ref({}),
  }

  async init() {
    await this.requestSite(stores.global.get('lang'))
    stores.global.watch('lang', onChangeLang)
  }

  /**
   * Setter
   */
  set(key: string|Object, val?: any): void {
    switch(key) {
      case 'xy':
        break
    }
  }

  /**
   * Request site, implicit done on init().
   */
  async requestSite(lang: string): Promise<void> {
    const json = await getSite(lang, { raw: true })
    let res: Object = {}
    if (isObj(json) && json.ok) {
      if (has(json.body.fields, 'title') && stores.meta) {
        stores.meta.set('brand', json.body.fields.title.value)
      }
      res = convertResponse(json)
    }
    this._data.meta.value = res.meta ?? {}
    this._data.link.value = res.link ?? {}
    this._data.fields.value = res.fields ?? {}
  }
}

export default SiteStore