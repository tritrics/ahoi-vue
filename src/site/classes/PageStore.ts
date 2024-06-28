import { has, uuid, isStr, isObj, toKey } from '../../fn'
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
      node: '',
      blueprint: 'default',
      meta: {},
      link: {},
      fields: {}
    })
  }

  /**
   * Getting href for a given language.
   */
  getHref(lang: string): string|null {
    const meta = this.get('meta')
    lang = toKey(lang)
    if (has(meta, 'translations')) {
      for(const key in meta.translations) {
        if (meta.translations[key].lang === lang) {
          return meta.translations[key].href
        }
      }
    }
    return null
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
      return
    }
    if (!isObj(json) || !json.ok) {
      super._set('node', '')
      super._set('blueprint', 'default')
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
    super._set('blueprint', res.meta.blueprint ?? 'default')
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