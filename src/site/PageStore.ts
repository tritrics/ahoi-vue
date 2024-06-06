import { ref } from 'vue'
import { has, isStr, isObj } from '../fn'
import { convertResponse } from './index'
import { stores } from '../api'
import { getPage } from '../api/api'
import Store from '../api/Store'
import type { IStore } from '../types'
import type { Object } from '../types'

/**
 * Store with plugin and addons options.
 */
class PageStore extends Store implements IStore {

  /**
   * Object with store values.
   */
  _data: Object = {
    node: ref(''),
    meta: ref({}),
    link: ref({}),
    fields: ref({}),
  }

  /**
   * Setter
   */
  set(key: string|Object, val?: any): void {
    switch(key) {
      case 'node':
        if (isStr(val)) {
          this.requestPage(val)
        }
        break
      case 'route':
        if (isStr(val)) {
          this.requestPageFromRoute(val)
        }
        break
    }
  }

  async requestPage(node: string): Promise<void> {
    const json = await getPage(node, { raw: true })
    let res: Object = {}
    if (isObj(json) && json.ok) {
      if (has(json.body.fields, 'title') && stores.meta) {
        stores.meta.set('title', json.body.fields.title.value)
      }
      res = convertResponse(json)
    }
    this._data.node.value = node
    this._data.meta.value = res.meta ?? {}
    this._data.link.value = res.link ?? {}
    this._data.fields.value = res.fields ?? {}
  }

  /**
   * Request a page from a router path.
   */
  async requestPageFromRoute(route: Object): Promise<void> {
    this.requestPage('/de/apitest')
  }
}

export default PageStore