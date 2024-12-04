import { uuid, toPath, isStr } from '../../utils'
import { ImmutableStore, getPage, apiStore } from '../../plugin'
import { convertResponse } from '../index'
import type { Object, ISiteStore } from '../../types'

/**
 * Store holding site, page and home-page models.
 */
class SiteStore extends ImmutableStore implements ISiteStore {

  /**
   * Intern storage of requested objects, before commited.
   */
  #next: Object = {
    page: null
  }

  /**
   * Avoid race conditions
   */
  #requestid: Object = {
    site: null,
    page: null,
    home: null
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
   * Commit (= make active) of page object.
   */
  commitPage() {
    this._set('page', this.#next.page)
  }

  /**
   * Request page
   * mixed can be node or path
   */
  async loadHome(lang: string|null): Promise<void> {
    const node = toPath(lang, apiStore.get('home'))
    return this.#request('home', node, [ 'title' ])
  }

  /**
   * Request page by given node
   */
  async loadPage(
    node: string,
    fields: string[]|boolean|'*' = '*',
    languages: boolean|'*' = true,
    commit: boolean = true
  ): Promise<void> {
    return this.#request('page', node, fields, languages, commit)
  }

  /**
   * Request page by given path
   */
  async loadPageByPath(
    path: string,
    fields: string[]|boolean|'*' = '*',
    languages: boolean|'*' = true,
    commit: boolean = true
  ): Promise<void> {
    return this.#request('page', apiStore.getNodeFromPath(path), fields, languages, commit)
  }

  /**
   * Request site.
   */
  async loadSite(lang: string = ''): Promise<void> {
    if (!apiStore.isValidLang(lang)) {
      return Promise.resolve()
    }
    return this.#request('site', lang)
  }

  /**
   * Setter disabled
   */
  set(): void {}

  /**
   * Request a page (site, home).
   */
  async #request(
    key: string,
    node: string,
    fields: string[]|boolean|'*' = true,
    languages: boolean|'*' = true,
    commit: boolean = true
  ): Promise<void> {
    if (!isStr(node, 1)) {
      this.#setEmpty(key, commit)
    }
    this.#requestid[key] = uuid()
    try {
      const json = await getPage(node, {
        raw: true,
        id: this.#requestid[key],
        fields: fields,
        languages: languages
      })
      if (json?.id === this.#requestid[key]) {
        if (commit) {
          this._set(key, convertResponse(json))
        } else {
          this.#next[key] = convertResponse(json)
        }
      }
    }
    catch(E) {
      this.#setEmpty(key, commit)
    }
  }

  /**
   * Set empty page node on error.
   */
  #setEmpty(key: string, commit: boolean = true) {
    const json = {
      body: {
        type: 'page',
        meta: {}
      }
    }
    if (commit) {
      this._set(key, convertResponse(json))
    } else {
      this.#next[key] = convertResponse(json)
    }
  }
}

export default SiteStore