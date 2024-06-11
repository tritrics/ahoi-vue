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
     * The route of the page, if page is requested by route.
     * Empty, if page is requested by node.
     */
    route: ref<string>(''),

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
      case 'route':
        if (isStr(val) && val !== this._data.route.value) {
          this._data.route.value = val
          await this.set('node', this._detectNodeFromRoute(val))
        }
        break
    }
  }

  /**
   * Detect/guess the language from route.
   * @TODO: detect lang
   * wenn präfix bereits Sprache, dann ohne Änderung verwenden
   * - Problem: kein Prefix erlaubt auch, ein Sprachprefix als slug zu verwenden
   * - Problem: mehrere Sprachen haben keinen Prefix
   * Beim Wechsel der Sprache globalStore.set('lang')
   */
  _detectNodeFromRoute(route: string): string {
    const node = '/de/apitest'
    return node
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
    if (has(json.body.fields, 'title')) {
      stores('meta').set('title', json.body.fields.title.value)
    }
    const fn = inject('site', 'convertResponse', (json: JSONObject): JSONObject => json) as Function
    res = fn(json)
    this._data.meta.value = res.meta ?? res.body.meta
    this._data.link.value = res.link ?? {}
    this._data.fields.value = res.fields ?? res.body.fields
  }
}

export default PageStore