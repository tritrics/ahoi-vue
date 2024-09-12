import { uuid, isStr, isTrue } from '../../fn'
import { inject, getPage, globalStore, AddonStore } from '../../plugin'
import type { IPageStore } from '../types'
import type { Object } from '../../types'

/**
 * Store with plugin and addons options.
 */
class PageStore extends AddonStore implements IPageStore {

  /**
   * The last loaded page data (pageModel), before it's commited and therewith saved in store.
   */
  #response: Object = {
    node: null,
    model: {}
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
    this._set('node', this.#response.node)
    this._set('meta', this.#response.model.meta ?? {})
    this._set('link', this.#response.model.link ?? {})
    this._set('translations', this.#response.model.translations ?? [])
    this._set('fields', this.#response.model.fields ?? {})
    this._set('changed', this.get('changed') + 1)
  }

  /**
   * Helper to get the blueprint from last loaded data (not from store).
   */
  getBlueprint(): string|undefined {
    return this.#response.model.meta?.blueprint
  }

  /**
   * Temp. solution in case the object is needed
   * solution: rebuild stores to be PageModels?
   */
  getModel(): Object {
    return this.#response.model
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
    this.#response.node = node
    this.#response.model = convertResponse(json)
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