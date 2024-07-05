import { uuid, isStr, toPath } from '../../fn'
import { convertResponse } from '../index'
import { getPage, globalStore, AddonStore } from '../../plugin'
import type { Object, IPageStore } from '../../types'

/**
 * Store with link and translation values for homepage.
 */
class HomeStore extends AddonStore implements IPageStore {

  /**
   * Avoid race conditions
   */
  #requestid: string = ''

  /** */
  constructor() {
    super({
      node: null,
      link: {},
      translations: {},
    })
  }

  /**
   * Request page
   * mixed can be node or path
   */
  async load(lang: string|null): Promise<void> {
    const node = toPath(lang, globalStore.get('home'))
    if (!isStr(node, 1) || this.is('node', node)) {
      return
    }
    this.#requestid = uuid()
    const json = await getPage(node, { raw: true, id: this.#requestid, fields: [ 'title' ] })
    if (json.id !== this.#requestid) {
      return Promise.resolve()
    }
    const res: Object = convertResponse(json)
    this._set('node', node)
    this._set('link', res.link)
    this._set('translations', res.translations ?? [])
  }

  /**
   * Setter disabled
   */
  set(): void {}
}

export default HomeStore