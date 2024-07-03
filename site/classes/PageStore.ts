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
      node: null,
      blueprint: 'default',
      meta: {},
      link: {},
      translations: {},
      fields: {}
    })
  }

  /**
   * Request page
   * mixed can be node or path
   */
  async load(mixed: string, isPath: boolean = false): Promise<void> {
    const node = isPath ? globalStore.getNodeFromPath(mixed) : mixed
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
    super._set('node', node)
    super._set('blueprint', res.meta.blueprint ?? 'default')
    super._set('meta', res.meta)
    super._set('link', res.link)
    super._set('translations', res.translations ?? [])
    super._set('fields', res.fields ?? {})
  }

  /**
   * Setter disabled
   */
  set(): void {}
}

export default PageStore