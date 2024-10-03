import { uuid, toPath, isStr, isTrue, toKey } from '../../utils'
import { ImmutableStore, getPage, globalStore } from '../../plugin'
import { convertResponse } from '../index'
import type { Object, IDataStore, IPageModel } from '../../types'

/**
 * Store with plugin and addons options.
 */
class DataStore extends ImmutableStore implements IDataStore {

  /**
   * Language of requested site for intern checks
   */
  #lang: string|null = null
  
  /**
   * The last loaded page data (pageModel), before it's commited and therewith saved in store.
   */
  #pageModel: IPageModel|null = null

  /**
   * Avoid race conditions
   */
  #requestid: Object = {
    site: null,
    page: null,
    home: null,
  }

  /** */
  constructor() {
    super({
      path: null,
      site: null,
      page: null,
      home: null,
    })
  }

  /**
   * Save the last loaded page in store.
   */
  commitPage(): void {
    this._set('page', this.#pageModel)
  }

  /**
   * Helper to get the blueprint from last loaded page (not from store).
   */
  getPageBlueprint(): string|undefined {
    return this.#pageModel?.meta?.blueprint
  }

  /**
   * Request page
   * mixed can be node or path
   */
  async loadHome(lang: string|null): Promise<void> {
    const node = toPath(lang, globalStore.get('home'))
    if (!isStr(node, 1) || this.is('node', node)) {
      return
    }
    this.#requestid.home = uuid()
    const json = await getPage(node, { raw: true, id: this.#requestid.home, fields: [ 'title' ] })
    if (json.id !== this.#requestid.home) {
      return Promise.resolve()
    }
    this._set('home', convertResponse(json))
  }

  
  /**
   * Request page by given node
   */
  async loadPage(node: string, commit: boolean = true): Promise<void> {
    if (!isStr(node, 1) || this.is('node', node)) {
      return
    }
    this.#requestid.page = uuid()
    const json = await getPage(node, { raw: true, id: this.#requestid.page })
    if (json.id !== this.#requestid.home) {
      return Promise.resolve()
    }
    this.#pageModel = convertResponse(json) as IPageModel
    if (isTrue(commit)) {
      this.commitPage()
    }
  }

  /**
   * Request page by given path
   */
  async loadPageByPath(path: string, commit: boolean = true): Promise<void> {
    if (!isStr(path, 1)) {
      return
    }
    this._set('path', path)
    return await this.loadPage(globalStore.getNodeFromPath(path), commit)
  }

  /**
   * Request site.
   */
  async loadSite(lang: string|null = null): Promise<void> {
    if (!globalStore.isValidLang(lang) || (this.isNot('site', null) && this.#lang === toKey(lang))) {
      return
    }
    this.#requestid.site = uuid()
    const json = await getPage(lang, { raw: true, id: this.#requestid.site })
    if (json.id !== this.#requestid.home) {
      return Promise.resolve()
    }
    this.#lang = toKey(lang)
    this._set('site', convertResponse(json))
  }

  /**
   * Setter disabled
   */
  set(): void {}
}

export default DataStore