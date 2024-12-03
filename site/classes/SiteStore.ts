import { uuid, toPath, isStr } from '../../utils'
import { ImmutableStore, getPage, apiStore } from '../../plugin'
import { convertResponse } from '../index'
import type { Object, ISiteStore } from '../../types'

/**
 * Store holding site, page and home-page models.
 */
class SiteStore extends ImmutableStore implements ISiteStore {

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
      site: null,
      page: null,
      home: null,
    })
  }

  /**
   * Request a page (site, home) and set property.
   */
  async #setPage(
    key: string,
    node: string,
    fields: string[]|boolean|'*' = '*',
    languages: boolean|'*' = true
  ): Promise<void> {
    if (!isStr(node, 1)) {
      this.#setEmpty(key)
      return Promise.resolve()
    }
    this.#requestid[key] = uuid()
    try {
      const json = await getPage(node, {
        raw: true,
        id: this.#requestid[key],
        fields: fields,
        languages: languages
      })
      if (json?.id !== this.#requestid[key]) {
        return Promise.resolve()
      }
      this._set(key, convertResponse(json))
    }
    catch(E) {
      this.#setEmpty(key)
    }
  }

  /**
   * Request page
   * mixed can be node or path
   */
  async loadHome(lang: string|null): Promise<void> {
    const node = toPath(lang, apiStore.get('home'))
    return this.#setPage('home', node, [ 'title' ], true)
  }

  /**
   * Request page by given node
   */
  async loadPage(node: string, fields: string[]|boolean|'*' = '*', languages: boolean|'*' = true): Promise<void> {
    return this.#setPage('page', node, fields, languages)
  }

  /**
   * Request page by given path
   */
  async loadPageByPath(path: string, fields: string[]|boolean|'*' = '*', languages: boolean|'*' = true): Promise<void> {
    return this.#setPage('page', apiStore.getNodeFromPath(path), fields, languages)
  }

  /**
   * Request site.
   */
  async loadSite(lang: string = ''): Promise<void> {
    if (!apiStore.isValidLang(lang)) {
      return Promise.resolve()
    }
    return this.#setPage('site', lang, true, true)
  }

  /**
   * Setter disabled
   */
  set(): void {}

  /**
   * Set empty page node on error.
   */
  #setEmpty(key: string) {
    const json = {
      body: {
        type: 'page',
        meta: {}
      }
    }
    this._set(key, convertResponse(json))
  }
}

export default SiteStore