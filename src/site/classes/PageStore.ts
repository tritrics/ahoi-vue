import { has, isStr, isObj } from '../../fn'
import { convertResponse } from '../index'
import { inject, getPage, stores, AddonStore } from '../../plugin'
import type { Object, IPageStore } from '../../types'

/**
 * Store with plugin and addons options.
 */
class PageStore extends AddonStore implements IPageStore {

  /** */
  constructor() {
    super({
      node: '',
      meta: {},
      link: {},
      fields: {}
    })
  }

  /**
   * Setter
   */
  async set(key: string, val?: any): Promise<void> {
    switch(key) {
      case 'node':
        if (isStr(val) && this.isNot('node', val)) {
          super.set('node', val)
          await this.#setPage(val)
        }
        break
    }
  }

  /**
   * Request the page and set store values.
   */
  async #setPage(node: string): Promise<void> {
    const json = await getPage(node, { raw: true })
    if (!isObj(json) || !json.ok) {
      super.set('meta', {})
      super.set('link', {})
      super.set('fields', {})
      return
    }
    if (inject('meta') && has(json.body.fields, 'title')) {
      stores('meta').set('title', json.body.fields.title.value)
    }
    const res: Object = convertResponse(json)
    super.set('meta', res.meta)
    super.set('link', res.link)
    super.set('fields', res.fields)
  }
}

export default PageStore