import { ref } from 'vue'
import { has, isStr, isObj } from '../../fn'
import { inject, getPage, stores, BaseStore, globalStore } from '../../plugin'
import type { IPageMeta, ILinkModel, IModelList } from '../models/types'
import type { Object, IPageStore } from '../../types'

/**
 * Store with plugin and addons options.
 */
class PageStore extends BaseStore implements IPageStore {

  /**
   * Object with store values.
   */
  _data: Object = {

    /**
     * The resquested node
     */
    node: ref<string>(''),

    /**
     * Meta object from response
     */
    meta: ref<IPageMeta>(),

    /**
     * Link object from response
     */
    link: ref<ILinkModel>(),

    /**
     * List of fields from response
     */
    fields: ref<IModelList>({}),
  }

  /**
   * Setter
   */
  async set(key: string, val?: any): Promise<void> {
    switch(key) {
      case 'node':
        if (isStr(val) && val !== this._data.node.value) {
          this._data.node.value = val
          await this._requestPage(val)
        }
        break
    }
  }

  /**
   * Request the page and set store values.
   */
  async _requestPage(node: string): Promise<void> {
    const json = await getPage(node, { raw: true })
    let res: Object = {}
    if (!isObj(json) || !json.ok) {
      this._data.meta.value = {}
      this._data.link.value = {}
      this._data.fields.value = {}
      return
    }
    if (inject('meta') && has(json.body.fields, 'title')) {
      stores('meta').set('title', json.body.fields.title.value)
    }
    if (inject('site')) {
      const convertResponse = inject('site', 'convertResponse') as Function
      res = convertResponse(json)
    }
    this._data.meta.value = res.meta ?? res.body.meta
    this._data.link.value = res.link ?? {}
    this._data.fields.value = res.fields ?? res.body.fields
  }
}

export default PageStore