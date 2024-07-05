import { escape, upperFirst, isStr, isUrl, isEmpty, isNull, toStr, isFunc } from '../../fn'
import { UserStore, optionsStore, globalStore } from '../../plugin'
import type { IMetaStore } from '../../types'

/**
 * Meta value store, extends user store, because user can add more properties.
 */
class MetaStore extends UserStore implements IMetaStore {

  constructor() {
    super({
      brand: '',
      description: '',
      lang: '',
      locale: '',
      image: '',
      separator: ' - ',
      title: '',
      //url: ''
    })
  }
  
  /**
   * Initialization
   */
  async init(): Promise<void> {

    // get user-values from options
    this._setBrand(optionsStore.get('brand'))
    this._setDescription(optionsStore.get('description'))
    this._setImage(optionsStore.get('image'))
    this._setSeparator(optionsStore.get('separator'))
    this._setTitle(optionsStore.get('title'))

    // watcher
    globalStore.watch('lang', (newVal: string) => {
      this._setLang(newVal)
    }, { immediate: true })
    globalStore.watch('locale', (newVal: string) => {
      this._setLocale(newVal)
    }, { immediate: true })
    return Promise.resolve()
  }

  /**
   * Public setter
   * Overwritten because of #writeMeta()
   */
  set(key: string, val?: any): void {
    if (isStr(key, 1)) {
      const setter: string = `_set${upperFirst(key)}`
      if (isFunc((<any>this)[setter])) {
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
  //_setUrl(val: any): void {
  //  if (isUrl(val) || isEmpty(val)) {
  //    this._set('url', val)
  //    this.#writeMeta('og:url', val)
  //  }
  //}

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