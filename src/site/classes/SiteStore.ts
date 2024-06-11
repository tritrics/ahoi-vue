
import { ref } from 'vue'
import { isObj } from '../../fn'
import { BaseStore, getSite, globalStore } from '../../plugin'
import { convertResponse } from '../index'
import type { IPageModel, ILinkModel, IModelList, IPageMeta } from '../models/types'
import type { Object, IBaseStore } from '../../types'

/**
 * Store with plugin and addons options.
 */
class SiteStore extends BaseStore implements IBaseStore {

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
     * Home page
     */
    home: ref<IPageModel>(),

    /**
     * List of fields from response.
     */
    fields: ref<IModelList>({}),
  }

  /**
   * Init store.
   * Is called, after all store instances have been created.
   */
  async init(): Promise<void> {
    globalStore.watch('lang', async (newVal: string) => {
      await this._requestSite(newVal)
    }, { immediate: true })
  }

  /**
   * Setter disabled.
   */
  async set(): Promise<void> {}

  /**
   * Request site, implicit done on init().
   */
  async _requestSite(lang: string): Promise<void> {
    const json = await getSite(lang, { raw: true })
    let res: Object = {}
    if (isObj(json) && json.ok) {
      res = convertResponse(json)
      this._data.node.value = lang ?? ''
      this._data.meta.value = res.meta
      this._data.link.value = res.link
      this._data.home.value = res.home
      this._data.fields.value = res.fields
    }
  }
}

export default SiteStore