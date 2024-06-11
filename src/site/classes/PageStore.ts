import { ref } from 'vue'
import { has, isStr, isObj } from '../../fn'
import { inject, getPage, stores, BaseStore } from '../../plugin'
import type { IPageMeta, ILinkModel, IModelList } from '../models/types'
import type { Object, IPageStore, JSONObject } from '../../types'

/**
 * Store with plugin and addons options.
 */
class PageStore extends BaseStore implements IPageStore {

  /**
   * Object with store values.
   */
  _data: Object = {

    /**
     * The resquested node (= lang or empty).
     */
    node: ref<string>(''),

    /**
     * Meta object from response.
     */
    meta: ref<IPageMeta>(),

    /**
     * Link object from response.
     */
    link: ref<ILinkModel>(),

    /**
     * List of fields from response.
     */
    fields: ref<IModelList>({}),
  }

  /**
   * Setter
   */
  async set(key: string, val?: any): Promise<void> {
    switch(key) {
      case 'node':
        if (isStr(val)) {
          this._requestPage(val)
        }
        break
      case 'route':
        if (isObj(val)) {
          this._requestPageFromRoute(val)
        }
        break
    }
  }

  async _requestPage(node: string): Promise<void> {
    const json = await getPage(node, { raw: true })
    let res: Object = {}
    if (isObj(json) && json.ok) {
      if (has(json.body.fields, 'title')) {
        stores('meta').set('title', json.body.fields.title.value)
      }
      const fn = inject('site', 'convertResponse', (json: JSONObject): JSONObject => json) as Function
      res = fn(json)
      this._data.node.value = node
      this._data.meta.value = res.meta ?? res.body.meta
      this._data.link.value = res.link ?? {}
      this._data.fields.value = res.fields ?? res.body.fields
    }
  }

  /**
   * Request a page from a router path.
   */
  async _requestPageFromRoute(route: Object): Promise<void> {
    this._requestPage('/de/apitest')
  }
}

export default PageStore