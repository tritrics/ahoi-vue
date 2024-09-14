import { escape, upperFirst, has, each, isStr, isUrl, isEmpty, isNull, toStr, isFn } from '../../fn'
import { UserStore, optionsStore, globalStore, inject, stores } from '../../plugin'
import { createThumb } from '../../site'
import type { IMetaStore, IMetaConfigFields, IMetaConfigField } from '../types'
import type { Object, IBaseStore, IFilesModel, IFileModel } from '../../types'

/**
 * Meta value store, extends user store, because user can add more properties.
 */
class MetaStore extends UserStore implements IMetaStore {

  /**
   * Map of metafields, which can be
   */
  #metaFields: IMetaConfigFields = {
    brand: {},
    description: {},
    keywords: {},
    image: {},
    separator: {},
    title: {}
  }

  constructor() {
    super({
      brand: '',
      description: '',
      keywords: '',
      lang: '',
      locale: '',
      image: '',
      separator: ' - ',
      title: '',
      url: '' // todo
    })
  }
  
  /**
   * Initialization
   */
  async init(): Promise<void> {

    // fields defined in config, taken from config, siteStore or pageStore
    const watch = this.#setMetaFields(optionsStore.get('meta'))
    if (watch.site) {
      stores('site').watch('changed', () => this.#updateMeta())
    }
    if (watch.page) {
      stores('page').watch('changed', () => this.#updateMeta())
    }

    // lang from globalStore
    if (globalStore.isTrue('multilang')) {
      globalStore.watch('lang', (newVal: string) => {
        this._setLang(newVal)
      }, { immediate: true })
    } else {
      globalStore.watch('detected', (newVal: string) => {
        this._setLang(newVal)
      }, { immediate: true })
    }

    // locale from globalStore
    globalStore.watch('locale', (newVal: string) => {
      this._setLocale(newVal)
    }, { immediate: true })

    // url from routerStore
    if (inject('router')) {
      stores('router').watch('url', (newVal: string) => {
        this._setUrl(newVal)
      }, { immediate: true })
    }
    return Promise.resolve()
  }

  /**
   * Public setter
   * Overwritten because of #writeMeta()
   */
  set(key: string, val?: any): void {
    if (isStr(key, 1)) {
      const setter: string = `_set${upperFirst(key)}`
      if (isFn((<any>this)[setter])) {
        (<any>this)[setter](val)
      } else {
        this._set(key, val)
        this.#writeMeta(key, val)
      }
    }
  }

  /**
   * Setter for brand meta value
   */
  _setBrand(val: any): void {
    if (isStr(val) || isNull(val)) {
      val = toStr(val)
      this._set('brand', val)
      this.#writeMeta('og:site_name', val)
      this.#writeTitle()
    }
  }

  /**
   * Setter for description meta value
   */
  _setDescription(val: any): void {
    if (isStr(val) || isNull(val)) {
      val = toStr(val)
      this._set('description', val)
      this.#writeMeta('description', val)
      this.#writeMeta('og:description', val)
      this.#writeMeta('twitter:card', val)
    }
  }

  /**
   * Setter for keywords meta value
   */
  _setKeywords(val: any): void {
    if (isStr(val) || isNull(val)) {
      val = toStr(val)
      this._set('keywords', val)
      this.#writeMeta('keywords', val)
    }
  }

  /**
   * Setter for lang meta value
   */
  _setLang(val: any): void {
    if (isStr(val) || isNull(val)) {
      val = toStr(val)
      this._set('lang', val)
      this.#writeLang()
    }
  }

  /**
   * Setter for locale meta value
   */
  _setLocale(val: any): void {
    if (isStr(val) || isNull(val)) {
      val = toStr(val)
      this._set('locale', val)
      this.#writeMeta('og:locale', val)
    }
  }

  /**
   * Setter for image meta value
   */
  _setImage(val: any): void {
    if (isUrl(val) || isNull(val)) {
      val = toStr(val)
      this._set('image', val)
      this.#writeMeta('og:image', val)
    }
  }

  /**
   * Setter for title separator
   */
  _setSeparator(val: any): void {
    if (isStr(val)) {
      this._set('separator', val)
      this.#writeTitle()
    }
  }

  /**
   * Setter for title meta value
   */
  _setTitle(val: any): void {
    if (isStr(val) || isNull(val)) {
      val = toStr(val)
      this._set('title', val)
      this.#writeTitle()
    }
  }

  /**
   * Setter for url meta value
   */
  _setUrl(val: any): void {
    if (isUrl(val) || isEmpty(val)) {
      this._set('url', val)
      this.#writeMeta('og:url', val)
    }
  }

  /**
   * Set a meta value from a given field from a model.
   */
  #setFromModel(model: IFilesModel|undefined, field: string): boolean {
    if (!model) {
      return false
    }
    switch(field) {
      case 'image': {
        const file = model.first() as IFileModel
        if (file && file.isImage()) {
          const thumb = createThumb(file, 1200, 630) // make definable by user
          if (thumb) {
            this._setImage(thumb.src())
            return true
          }
        }
        break
      }
      default: {
        const value = model.str()
        if (isStr(value, 1)) {
          this.set(field, value)
          return true
        }
      }
    }
    return false
  }

  /**
   * Helper for init().
   * Set #metaFields from user options.
   */
  #setMetaFields(config: Object): { page: boolean, site: boolean } {
    const res = { page: false, site: false }
    const hasPage: boolean = inject('page') as boolean
    each(this.#metaFields, (def: IMetaConfigField, field: string) => {
      if (has(config, field)) {
        this.set(field, config[field]?.default ?? config[field])
        if (isStr(config[field]?.site, 1)) {
          this.#metaFields[field].site = config[field].site
          res.site = true
        }
        if (hasPage && isStr(config[field]?.page, 1)) {
           this.#metaFields[field].page = config[field].page
           res.page = true
        }
      }
    })
    return res
  }

  /**
   * Batch-update meta fields, which are taken from siteStore or pageStore.
   * Try to get content field 1st from page and 2nd from site.
   */
  #updateMeta(): void {
    const pageStore: IBaseStore = stores('page') // possibly undefined
    const siteStore: IBaseStore = stores('site')
    each(this.#metaFields, (def: IMetaConfigField, field: string) => {
      let res
      if (pageStore && def.page) {
        res = this.#setFromModel(pageStore.get(`fields.${def.page}`), field)
      }
      if (!res && def.site) {
        this.#setFromModel(siteStore.get(`fields.${def.site}`), field)
      }
    })
  }

  /**
   * setting lang in <html>
   */
  #writeLang(): void {
    const content: string = escape(this.get('lang'))
    if (document.documentElement.getAttribute('lang') !== content) {
      document.documentElement.setAttribute('lang', content)
    }
  }

  /**
   * setting meta in <head>
   */
  #writeMeta(name: string, val: string): void {
    const content: string = escape(val)
    const type: 'name'|'property' = name.startsWith('og:') ? 'property' : 'name'
    const nodes = document.head.querySelectorAll(`meta[${type}="${name}"]`)
    if (nodes.length === 0) {
      if (!isEmpty(content)) {
        const meta = document.createElement('meta')
        meta.setAttribute(type, name)
        meta.setAttribute('content', content)
        document.getElementsByTagName('head')[0].appendChild(meta as HTMLHeadElement)
      }
    } else {
      nodes.forEach(node => {
        if (node.getAttribute('content') !== content) {
          node.setAttribute('content', content)
        }
      })
    }
  }

  /**
   * setting title in <head><title>
   */
  #writeTitle(): void {
    const parts: string[] = []
    if (isStr(this.get('title'), 1)) {
      parts.push(this.get('title'))
    }
    if (isStr(this.get('brand'), 1)) {
      parts.push(this.get('brand'))
    }
    const title = parts.join(this.get('separator'))
    this.#writeMeta('og:title', title)
    const content: string = escape(title)
    if (document.title !== content) {
      document.title = content
    }
  }
}

export default MetaStore