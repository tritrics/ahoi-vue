import { has, uuid, isStr } from '../../fn'
import { convertResponse } from '../index'
import { inject, getPage, stores, globalStore, AddonStore } from '../../plugin'
import type { Object, IPageStore } from '../../types'

/**
 * Store with plugin and addons options.
 */
class PageStore extends AddonStore implements IPageStore {

  /**
   * Avoid race conditions
   */
  #requestid: string = ''

  /** */
  constructor() {
    super({
      path: null,
      node: null,
      meta: {},
      link: {},
      translations: {},
      fields: {}
    })
  }

  /**
   * Request page by given node
   */
  async load(node: string): Promise<void> {
    if (!isStr(node, 1) || this.is('node', node)) {
      return
    }
    this.#requestid = uuid()
    const json = await getPage(node, { raw: true, id: this.#requestid })
    if (json.id !== this.#requestid) {
      return Promise.resolve()
    }
    if (inject('meta') && has(json.body.fields, 'title')) {
      stores('meta').set('title', json.body.fields.title.value)
    }
    const res: Object = convertResponse(json)
    this._set('node', node)
    this._set('meta', res.meta)
    this._set('link', res.link)
    this._set('translations', res.translations ?? [])
    this._set('fields', res.fields ?? {})
  }

  /**
   * Request page by given path
   */
  async loadByPath(path: string): Promise<void> {
    if (!isStr(path, 1)) {
      return
    }
    this._set('path', path)
    return await this.load(globalStore.getNodeFromPath(path))
  }

  /**
   * Setter disabled
   */
  set(): void {}
}

export default PageStore