import { uuid, isStr, isTrue } from '../../fn'
import { inject, getPage, globalStore, AddonStore } from '../../plugin'
import type { IPageStore } from '../types'
import type { Object } from '../../types'

/**
 * Store with plugin and addons options.
 */
class PageStore extends AddonStore implements IPageStore {

  /**
   * The last loaded page data, before it's commited and therewith saved in store.
   */
  #dataLoaded: Object = {
    node: null,
    response: {}
  }

  /**
   * Avoid race conditions
   */
  #requestid: string = ''

  /** */
  constructor() {
    super({
      changed: 0,
      path: null,
      node: null,
      meta: {},
      link: {},
      translations: {},
      fields: {}
    })
  }

  /**
   * Save the last loaded data in store.
   */
  commit(): void {
    this._set('node', this.#dataLoaded.node)
    this._set('meta', this.#dataLoaded.response.meta)
    this._set('link', this.#dataLoaded.response.link)
    this._set('translations', this.#dataLoaded.response.translations ?? [])
    this._set('fields', this.#dataLoaded.response.fields ?? {})
    this._set('changed', this.get('changed') + 1)
  }

  /**
   * Helper to get the blueprint from last loaded data (not from store).
   */
  getBlueprint(): string|undefined {
    return this.#dataLoaded.response.meta?.blueprint
  }

  /**
   * Request page by given node
   */
  async load(node: string, commit: boolean = true): Promise<void> {
    if (!isStr(node, 1) || this.is('node', node)) {
      return
    }
    this.#requestid = uuid()
    const json = await getPage(node, { raw: true, id: this.#requestid })
    if (json.id !== this.#requestid) {
      return Promise.resolve()
    }
    const convertResponse = inject('site', 'convertResponse') as Function
    this.#dataLoaded.node = node
    this.#dataLoaded.response = convertResponse(json)
    if (isTrue(commit)) {
      this.commit()
    }
  }

  /**
   * Request page by given path
   */
  async loadByPath(path: string, commit: boolean = true): Promise<void> {
    if (!isStr(path, 1)) {
      return
    }
    this._set('path', path)
    return await this.load(globalStore.getNodeFromPath(path), commit)
  }

  /**
   * Setter disabled
   */
  set(): void {}
}

export default PageStore