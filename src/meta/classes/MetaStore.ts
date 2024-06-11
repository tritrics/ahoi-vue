import { ref } from 'vue'
import { escape, isStr, isUrl, isEmpty, isNull, toStr } from '../../fn'
import { BaseStore, globalStore } from '../../plugin'
import type { Object, IMetaStore } from '../../types'

/**
 * Store with plugin and addons options.
 */
class MetaStore extends BaseStore implements IMetaStore {

  /**
   * Object with store values.
   */
  _data: Object = {

    /**
     * Brand of the page (= site title)
     */
    brand: ref<string>(''),

    /**
     * Meta description
     */
    description: ref<string>(''),

    /**
     * Lang in <html>
     * Taken from global store
     */
    lang: ref<string>(''),

    /**
     * Meta locale
     * Taken from global store
     */
    locale: ref<string>(''),

    /**
     * Meta preview image
     */
    image: ref<string>(''),

    /**
     * Separator to combine brand and title in <title>
     */
    separator: ref<string>(' - '),

    /**
     * Title of the page (= page title)
     */
    title: ref<string>(''),

    /**
     * Meta url
     */
    // url: ref<string>(''),
  }

  /**
   * Init store.
   * Is called, after all store instances have been created.
   */
  async init(): Promise<void> {

    // @TODO: make values dynamic from field values in site or page
    this.set('brand', globalStore.getOption('brand'))
    this.set('description', globalStore.getOption('description'))
    this.set('lang', globalStore.getOption('lang'))
    this.set('locale', globalStore.getOption('locale'))
    this.set('image', globalStore.getOption('image'))
    this.set('title', globalStore.getOption('title'))

    globalStore.watch('lang', (newVal: string) => {
      this.set('lang', newVal)
    }, { immediate: true })
    globalStore.watch('locale', (newVal: string) => {
      this.set('locale', newVal)
    }, { immediate: true })
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
        this._data.brand.value = val
        this._writeMeta('og:site_name', val)
        this._writeTitle()
        break
      case 'description':
        this._data.description.value = val
        this._writeMeta('description', val)
        this._writeMeta('og:description', val)
        this._writeMeta('twitter:card', val)
        break
      case 'lang':
        this._data.lang.value = val
        this._writeLang()
        break
      case 'locale':
        this._data.locale.value = val
        this._writeMeta('og:locale', val)
        break
      case 'image':
        this._data.image.value = val
        this._writeMeta('og:image', val)
        break
      case 'separator':
        this._data.separator.value = val
        this._writeTitle()
        break
      case 'title':
        this._data.title.value = val
        this._writeTitle()
        break
      //case 'url':
      //  if (isUrl(val) || isEmpty(val)) {
      //    this._data.url.value = val
      //    this._writeMeta('og:url', val)
      //  }
      //  break
      default:
        this._data[key] = ref(val)
        this._writeMeta(key, val)
    }
  }

  /**
   * setting lang in <html>
   */
  _writeLang(): void {
    const content: string = escape(this._data.lang.value)
    if (document.documentElement.getAttribute('lang') !== content) {
      document.documentElement.setAttribute('lang', content)
    }
  }

  /**
   * setting meta in <head>
   */
  _writeMeta(name: string, val: string): void {
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
  _writeTitle(): void {
    const parts: string[] = []
    if (isStr(this._data.title.value, 1)) {
      parts.push(this._data.title.value)
    }
    if (isStr(this._data.brand.value, 1)) {
      parts.push(this._data.brand.value)
    }
    const title = parts.join(this._data.separator.value)
    this._writeMeta('og:title', title)
    const content: string = escape(title)
    if (document.title !== content) {
      document.title = content
    }
  }
}

export default MetaStore