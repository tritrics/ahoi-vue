import { escape, isStr, isUrl, isEmpty, isNull, toStr } from '../../fn'
import { UserStore, optionsStore } from '../../plugin'
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

    // get user-values from options
    this.set('brand', optionsStore.get('brand'))
    this.set('description', optionsStore.get('description'))
    this.set('lang', optionsStore.get('lang'))
    this.set('locale', optionsStore.get('locale'))
    this.set('image', optionsStore.get('image'))
    this.set('separator', optionsStore.get('separator'))
    this.set('title', optionsStore.get('title'))

    // watch lang, locale
  }

  /**
   * Setter
   */
  async set(key: string, val?: any): Promise<void> {
    if (!isStr(val) && !isNull(val)) {
      return
    }
    val = toStr(val)
    switch(key) {
      case 'brand':
        super.set('brand', val)
        this.#writeMeta('og:site_name', val)
        this.#writeTitle()
        break
      case 'description':
        super.set('description', val)
        this.#writeMeta('description', val)
        this.#writeMeta('og:description', val)
        this.#writeMeta('twitter:card', val)
        break
      case 'lang':
        super.set('lang', val)
        this.#writeLang()
        break
      case 'locale':
        super.set('locale', val)
        this.#writeMeta('og:locale', val)
        break
      case 'image':
        super.set('image', val)
        this.#writeMeta('og:image', val)
        break
      case 'separator':
        super.set('separator', val)
        this.#writeTitle()
        break
      case 'title':
        super.set('title', val)
        this.#writeTitle()
        break
      //case 'url':
      //  if (isUrl(val) || isEmpty(val)) {
      //    super.set('url', val)
      //    this.#writeMeta('og:url', val)
      //  }
      //  break
      default:
        super.set(key, val)
        this.#writeMeta(key, val)
    }
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