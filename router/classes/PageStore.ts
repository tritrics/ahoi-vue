import { has, uuid, isStr } from '../../fn'
import { inject, getPage, stores, globalStore, AddonStore } from '../../plugin'
import type { IPageStore } from '../types'
import type { Object } from '../../types'

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
    this._set('node', node)
    if (inject('site')) {
      const convertResponse = inject('site', 'convertResponse') as Function
      const res: Object = convertResponse(json)
      this._set('meta', res.meta)
      this._set('link', res.link)
      this._set('translations', res.translations ?? [])
      this._set('fields', res.fields ?? {})
    } else {
      this._set('meta', json.body.meta)
      this._set('link', {})
      this._set('translations', json.body.translations ?? [])
      this._set('fields', json.body.fields ?? {})
    }
    
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