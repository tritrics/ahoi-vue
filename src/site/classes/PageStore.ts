import { has, uuid, isStr, isObj } from '../../fn'
import { convertResponse } from '../index'
import { inject, getPage, stores, AddonStore } from '../../plugin'
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
      node: '',
      meta: {},
      link: {},
      fields: {}
    })
  }

  /**
   * Request page
   * mixed can be path or router object "to"
   */
  async load(node: string): Promise<void> {
    if (!isStr(node, 1) || this.is('node', node)) {
      return
    }
    this.#requestid = uuid()
    const json = await getPage(node, { raw: true, id: this.#requestid })
    if (json.id !== this.#requestid) {
      return
    }
    if (!isObj(json) || !json.ok) {
      super._set('node', '')
      super._set('meta', {})
      super._set('link', {})
      super._set('fields', {})
      return Promise.reject()
    }
    if (inject('meta') && has(json.body.fields, 'title')) {
      stores('meta').set('title', json.body.fields.title.value)
    }
    const res: Object = convertResponse(json)
    super._set('node', node)
    super._set('meta', res.meta)
    super._set('link', res.link)
    super._set('fields', res.fields)
  }

  /**
   * Setter disabled
   */
  set(): void {}
}

export default PageStore