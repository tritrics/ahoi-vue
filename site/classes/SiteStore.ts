import { uuid, toPath, isStr, isTrue, toKey } from '../../utils'
import { ImmutableStore, getPage, apiStore } from '../../plugin'
import { convertResponse } from '../index'
import type { Object, ISiteStore, IPageModel, JSONObject } from '../../types'

/**
 * Store holding site, page and home-page models.
 */
class SiteStore extends ImmutableStore implements ISiteStore {

  /**
   * Language of requested site for intern checks
   */
  #lang: string|null = null
  
  /**
   * The last loaded page model, before it's commited and therewith saved in store.
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
   * Helper to get the next (uncommited) blueprint.
   */
  getNextPageBlueprint(): string|undefined {
    return this.#pageModel?.meta?.blueprint
  }

  /**
   * Helper to get the next (uncommited) pagetitle.
   */
  getNextPageTitle(): string|undefined {
    return this.#pageModel?.meta?.title
  }

  /**
   * Request page
   * mixed can be node or path
   */
  async loadHome(lang: string|null): Promise<void> {
    const node = toPath(lang, apiStore.get('home'))
    if (!isStr(node, 1) || this.is('node', node)) {
      return
    }
    this.#requestid.home = uuid()
    const json = await getPage(node, {
      raw: true,
      id: this.#requestid.home,
      fields: [ 'title' ],
      languages: true
    })
    if (json.id !== this.#requestid.home) {
      return Promise.resolve()
    }
    this._set('home', convertResponse(json))
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
    if (!isStr(node, 1) || this.is('node', node)) {
      return
    }
    this.#requestid.page = uuid()
    let json: JSONObject = {}
    try {
      json = await getPage(node, {
        raw: true,
        id: this.#requestid.page,
        fields: fields,
        languages: languages
      })
    }
    
    // load error page, if existing (otherwise an error is thrown)
    catch(E) {
      json = await getPage(
        toPath(apiStore.get('lang'), apiStore.get('error')),
        { raw: true, id: this.#requestid.page, fields: true }
      )
    }
    if (json?.id !== this.#requestid.page) {
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
  async loadPageByPath(
    path: string,
    fields: string[]|boolean|'*' = '*',
    languages: boolean|'*' = true,
    commit: boolean = true
  ): Promise<void> {
    if (!isStr(path, 1)) {
      return
    }
    this._set('path', path)
    return await this.loadPage(apiStore.getNodeFromPath(path), fields, languages, commit)
  }

  /**
   * Request site.
   */
  async loadSite(lang: string|null = null): Promise<void> {
    if (!apiStore.isValidLang(lang) || (this.isNot('site', null) && this.#lang === toKey(lang))) {
      return
    }
    this.#requestid.site = uuid()
    const json = await getPage(lang, {
      raw: true,
      id: this.#requestid.site,
      fields: true,
      languages: true
    })
    if (json.id !== this.#requestid.site) {
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

export default SiteStore